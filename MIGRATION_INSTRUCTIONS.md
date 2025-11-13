# 데이터베이스 마이그레이션 실행 가이드

## 사전 준비

### 1. 환경 변수 설정

`backend/.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
DATABASE_URL=postgresql://aether:aether123@localhost:5432/aether_island
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 2. 데이터베이스 생성

PostgreSQL이 실행 중인지 확인하고 데이터베이스를 생성하세요:

```bash
createdb aether_island
```

또는 PostgreSQL 클라이언트를 사용하여:

```sql
CREATE DATABASE aether_island;
```

### 3. 의존성 설치

```bash
cd backend
pip install -r requirements.txt
```

## 마이그레이션 실행

### 방법 1: Alembic 명령어 직접 사용

```bash
cd backend

# 초기 마이그레이션 생성
alembic revision --autogenerate -m "Initial migration"

# 데이터베이스 업그레이드
alembic upgrade head
```

### 방법 2: 스크립트 사용

```bash
cd backend

# 마이그레이션 생성
python scripts/migrate.py create -m "Initial migration"

# 데이터베이스 업그레이드
python scripts/migrate.py upgrade
```

### 방법 3: Docker Compose 사용 (권장)

```bash
# 백엔드 컨테이너에서 실행
docker-compose exec backend alembic revision --autogenerate -m "Initial migration"
docker-compose exec backend alembic upgrade head
```

## 마이그레이션 확인

### 현재 마이그레이션 버전 확인

```bash
cd backend
alembic current
```

### 마이그레이션 히스토리 확인

```bash
cd backend
alembic history
```

## 문제 해결

### 환경 변수를 읽을 수 없는 경우

1. `backend/.env` 파일이 존재하는지 확인
2. `.env` 파일의 형식이 올바른지 확인 (공백 없이 `KEY=value`)
3. 애플리케이션을 재시작

### 데이터베이스 연결 오류

1. PostgreSQL이 실행 중인지 확인:

```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

2. `DATABASE_URL`이 올바른지 확인
3. 데이터베이스 사용자 권한 확인

### 마이그레이션 충돌

여러 브랜치에서 동시에 작업한 경우:

1. 현재 마이그레이션 상태 확인:

```bash
alembic current
```

2. 충돌하는 마이그레이션 파일 확인
3. 수동으로 마이그레이션 파일 병합
4. 새로운 마이그레이션 생성하여 해결

## 롤백

이전 버전으로 롤백이 필요한 경우:

```bash
cd backend
alembic downgrade -1
```

특정 버전으로 롤백:

```bash
cd backend
alembic downgrade <revision>
```

## 프로덕션 환경

프로덕션 환경에서 마이그레이션 실행 시:

1. **데이터베이스 백업** 먼저 수행
2. 마이그레이션 파일 검토
3. 테스트 환경에서 먼저 테스트
4. 프로덕션 환경에 적용
5. 애플리케이션 재시작

## 주의사항

1. **항상 마이그레이션 파일을 검토하세요**
   - 자동 생성된 마이그레이션은 항상 검토 필요
   - 데이터 손실 가능성이 있는 작업은 주의

2. **프로덕션 환경에서 주의**
   - 프로덕션 환경에서는 항상 백업 먼저
   - 다운타임이 필요한 마이그레이션은 계획 필요

3. **마이그레이션 파일 관리**
   - 마이그레이션 파일은 Git에 커밋
   - 마이그레이션 파일을 수동으로 삭제하지 마세요

