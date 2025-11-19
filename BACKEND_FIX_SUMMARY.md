# 🔧 백엔드 연결 문제 해결 요약

## 🔍 문제 원인 분석

**주요 문제**: `backend/app/core/database.py`에서 모듈 로드 시점에 즉시 데이터베이스 연결을 테스트하고, 실패 시 예외를 발생시켜 FastAPI 서버가 시작되지 않았습니다.

### 발견된 문제점:

1. **database.py (16-21줄)**: 모듈 로드 시 `with engine.connect()`로 즉시 DB 연결 테스트
   - DB 연결 실패 시 `raise`로 예외 발생
   - 서버 시작이 완전히 블로킹됨
   - 포트 8000이 열리지 않음

2. **main.py**: lifespan에서 DB 연결 실패 시 처리 부족

3. **config.py**: CORS origins가 비어있을 경우 처리 부족

## ✅ 수정 사항

### 1. `backend/app/core/database.py`
- ❌ **이전**: 모듈 로드 시 즉시 DB 연결 테스트 → 실패 시 서버 시작 불가
- ✅ **수정**: Lazy connection 방식으로 변경
  - 엔진만 생성하고 실제 연결은 필요할 때만 수행
  - `pool_pre_ping=True`로 자동 재연결 보장
  - 연결 타임아웃 5초 설정
  - `test_db_connection()` 함수 추가 (선택적 호출)

### 2. `backend/app/main.py`
- ✅ lifespan에서 DB 연결 테스트를 선택적으로 수행
- ✅ DB 연결 실패해도 서버는 정상 시작
- ✅ 시작 메시지 개선

### 3. `backend/app/core/config.py`
- ✅ CORS origins가 비어있을 경우 기본값 보장
- ✅ localhost:3000, localhost:5173, localhost:8000 자동 포함

### 4. `start.sh`
- ✅ 기존 프로세스 자동 종료 기능 추가
- ✅ 서버 시작 확인 로직 추가
- ✅ nohup 사용으로 프로세스 안정성 향상

## 🚀 테스트 방법

### 1. 기존 백엔드 프로세스 종료

```bash
# 포트 8000 사용 중인 프로세스 확인 및 종료
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
```

### 2. 백엔드 재시작

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

또는

```bash
# 프로젝트 루트에서
./start.sh
# 옵션 2 선택 (로컬 실행)
```

### 3. 연결 테스트

```bash
# 기본 엔드포인트
curl http://localhost:8000

# Health check
curl http://localhost:8000/health

# API 문서
open http://localhost:8000/docs

# 회원가입 테스트
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
```

## 📋 예상 결과

### 정상 시작 시 출력:

```
🔗 데이터베이스 연결 설정: localhost:5432/aether_island
🚀 FastAPI 애플리케이션 시작 중...
✅ 데이터베이스 연결 성공
마정령 자율 행동 AI 백그라운드 프로세서를 시작합니다...
✅ 백그라운드 프로세서 시작 완료
✅ FastAPI 서버가 포트 8000에서 시작되었습니다!
📡 API 문서: http://localhost:8000/docs
🏥 Health check: http://localhost:8000/health
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### DB 연결 실패 시에도 서버는 시작:

```
🔗 데이터베이스 연결 설정: localhost:5432/aether_island
🚀 FastAPI 애플리케이션 시작 중...
⚠️ 데이터베이스 연결 실패: ... (서버는 계속 시작됩니다)
✅ FastAPI 서버가 포트 8000에서 시작되었습니다!
```

## 🔍 추가 디버깅

### 백엔드 로그 확인:

```bash
tail -f backend.log
```

### 포트 확인:

```bash
lsof -i :8000
```

### 프로세스 확인:

```bash
ps aux | grep uvicorn
```

## ⚠️ 주의사항

1. **데이터베이스 연결**: DB가 실행 중이어야 정상 작동합니다.
   - PostgreSQL 실행 확인: `brew services list | grep postgresql`
   - DB 시작: `brew services start postgresql@15`

2. **환경 변수**: `backend/.env` 파일이 올바르게 설정되어 있는지 확인

3. **포트 충돌**: 다른 프로세스가 8000 포트를 사용 중이면 자동으로 종료됩니다.

## 📝 수정된 파일 목록

1. `backend/app/core/database.py` - Lazy connection 방식으로 변경
2. `backend/app/main.py` - lifespan 개선
3. `backend/app/core/config.py` - CORS 기본값 보장
4. `start.sh` - 실행 스크립트 개선

