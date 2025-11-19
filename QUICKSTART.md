# 🚀 Aether Island 빠른 시작 가이드

## 방법 1: Docker Compose 사용 (권장) ⭐

가장 간단한 방법입니다. 모든 설정이 자동으로 완료됩니다.

### 1단계: 환경 변수 설정

```bash
# 백엔드 환경 변수
cd backend
cp env.example .env
# .env 파일을 열어 필요시 수정 (기본값으로도 동작)

# 프론트엔드 환경 변수
cd ../frontend
cp env.example .env
# .env 파일을 열어 필요시 수정 (기본값으로도 동작)
```

### 2단계: Docker Compose로 실행

```bash
# 프로젝트 루트에서
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 확인
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3단계: 데이터베이스 마이그레이션

```bash
# 백엔드 컨테이너에서 마이그레이션 실행
docker-compose exec backend alembic revision --autogenerate -m "Initial migration"
docker-compose exec backend alembic upgrade head

# 초기 데이터 생성 (선택사항)
docker-compose exec backend python init_db.py
docker-compose exec backend python init_items.py
```

### 4단계: 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

### Docker Compose 명령어

```bash
# 서비스 중지
docker-compose down

# 서비스 중지 및 볼륨 삭제 (데이터 초기화)
docker-compose down -v

# 서비스 재시작
docker-compose restart

# 특정 서비스만 재시작
docker-compose restart backend
docker-compose restart frontend
```

---

## 방법 2: 로컬에서 직접 실행

### 사전 요구사항

- Python 3.9+
- Node.js 18+
- PostgreSQL 15+
- npm 또는 yarn

### 1단계: PostgreSQL 설정

```bash
# PostgreSQL 설치 (macOS)
brew install postgresql
brew services start postgresql

# 데이터베이스 생성
createdb aether_island

# 또는 psql 사용
psql postgres
CREATE DATABASE aether_island;
CREATE USER aether WITH PASSWORD 'aether123';
GRANT ALL PRIVILEGES ON DATABASE aether_island TO aether;
\q
```

### 2단계: 백엔드 설정

```bash
cd backend

# 환경 변수 설정
cp env.example .env
# .env 파일 확인 및 수정

# 가상 환경 생성
python -m venv venv

# 가상 환경 활성화
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 마이그레이션
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# 초기 데이터 생성 (선택사항)
python init_db.py
python init_items.py

# 백엔드 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

백엔드가 실행되면:
- API: http://localhost:8000
- API 문서: http://localhost:8000/docs

### 3단계: 프론트엔드 설정

```bash
# 새 터미널에서
cd frontend

# 환경 변수 설정
cp env.example .env
# .env 파일 확인 및 수정 (VITE_API_URL=http://localhost:8000)

# 의존성 설치
npm install

# 프론트엔드 실행
npm run dev
```

프론트엔드가 실행되면:
- 웹앱: http://localhost:3000

---

## 방법 3: 개발 모드 (로컬 + Hot Reload)

개발 중에는 백엔드와 프론트엔드를 각각 실행하면 됩니다.

### 터미널 1: 백엔드

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 터미널 2: 프론트엔드

```bash
cd frontend
npm run dev
```

### 터미널 3: 데이터베이스 (필요시)

```bash
# PostgreSQL이 실행 중이어야 함
brew services start postgresql  # macOS
# 또는
sudo systemctl start postgresql  # Linux
```

---

## 🔍 문제 해결

### 백엔드 연결 오류

1. **데이터베이스 연결 오류**
   ```bash
   # PostgreSQL 실행 확인
   brew services list  # macOS
   sudo systemctl status postgresql  # Linux
   
   # 데이터베이스 연결 테스트
   psql -U aether -d aether_island -h localhost
   ```

2. **포트 충돌**
   ```bash
   # 포트 사용 확인
   lsof -i :8000  # macOS/Linux
   netstat -ano | findstr :8000  # Windows
   
   # 다른 포트 사용
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
   ```

3. **환경 변수 오류**
   ```bash
   # .env 파일 확인
   cat backend/.env
   
   # 환경 변수 직접 설정
   export DATABASE_URL=postgresql://aether:aether123@localhost:5432/aether_island
   ```

### 프론트엔드 연결 오류

1. **API 서버 연결 오류**
   ```bash
   # .env 파일 확인
   cat frontend/.env
   
   # VITE_API_URL이 올바른지 확인
   # 개발 모드: http://localhost:8000
   # Docker Compose: http://localhost:8000
   ```

2. **CORS 오류**
   - `backend/app/core/config.py`에서 CORS_ORIGINS 확인
   - 프론트엔드 URL이 포함되어 있는지 확인

3. **포트 충돌**
   ```bash
   # 포트 사용 확인
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   
   # vite.config.ts에서 포트 변경
   ```

### Docker 오류

1. **컨테이너가 시작되지 않음**
   ```bash
   # 로그 확인
   docker-compose logs
   
   # 컨테이너 상태 확인
   docker-compose ps
   
   # 컨테이너 재빌드
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **데이터베이스 연결 오류**
   ```bash
   # PostgreSQL 컨테이너 확인
   docker-compose ps postgres
   
   # 데이터베이스 로그 확인
   docker-compose logs postgres
   ```

3. **볼륨 마운트 오류**
   ```bash
   # 볼륨 확인
   docker volume ls
   
   # 볼륨 삭제 후 재생성
   docker-compose down -v
   docker-compose up -d
   ```

---

## 📝 환경 변수 설정

### 백엔드 (.env)

```env
DATABASE_URL=postgresql://aether:aether123@localhost:5432/aether_island
JWT_SECRET_KEY=your-secret-key-change-in-production-please-use-a-strong-random-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
PYTHON_ENV=development
```

### 프론트엔드 (.env)

```env
VITE_API_URL=http://localhost:8000
NODE_ENV=development
```

---

## 🎮 사용 방법

### 1. 회원가입
1. http://localhost:3000 접속
2. "회원가입" 클릭
3. 사용자명, 이메일, 비밀번호 입력
4. "회원가입" 버튼 클릭

### 2. 로그인
1. "로그인" 클릭
2. 사용자명과 비밀번호 입력
3. "로그인" 버튼 클릭

### 3. 마정령 생성
1. 메인 게임 페이지에서 "새 마정령 생성" 클릭
2. 이름, 속성, 성격 선택
3. "생성" 버튼 클릭

### 4. 마정령 관리
- 먹이 주기: 배고픔 증가
- 놀기: 행복도 증가
- 치료하기: 건강 상태 개선
- 씻기기: 청결도 증가
- 훈련하기: 스탯 증가

### 5. 아이템 구매 및 사용
1. "상점" 탭 클릭
2. 원하는 아이템 선택
3. "구매" 버튼 클릭
4. "인벤토리" 탭에서 아이템 사용

### 6. 대회 참가
1. "대회" 탭 클릭
2. 원하는 대회 선택
3. 마정령 선택
4. "참가" 버튼 클릭

---

## 🔧 개발 도구

### API 문서
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 테스트 실행
```bash
# 백엔드 테스트
cd backend
pytest

# 프론트엔드 테스트
cd frontend
npm test
```

### 코드 포맷팅
```bash
# 백엔드
cd backend
black app/
isort app/

# 프론트엔드
cd frontend
npm run lint
```

---

## 📚 추가 문서

- [환경 변수 설정 가이드](./ENV_SETUP.md)
- [데이터베이스 마이그레이션 가이드](./MIGRATION_GUIDE.md)
- [테스트 가이드](./README_TESTING.md)
- [프로젝트 설정 가이드](./프로젝트_설정_가이드.md)

---

## 💡 팁

1. **개발 모드**: `--reload` 플래그를 사용하면 코드 변경 시 자동으로 재시작됩니다.
2. **Hot Reload**: 프론트엔드는 Vite의 Hot Module Replacement(HMR)를 지원합니다.
3. **데이터베이스 백업**: 정기적으로 데이터베이스를 백업하세요.
4. **환경 변수**: 프로덕션 환경에서는 반드시 환경 변수를 변경하세요.
5. **보안**: JWT_SECRET_KEY는 반드시 강력한 랜덤 문자열로 변경하세요.

---

## 🆘 도움이 필요하신가요?

문제가 발생하면 다음을 확인하세요:
1. 환경 변수 설정
2. 데이터베이스 연결
3. 포트 충돌
4. 로그 메시지
5. 문서 참조

