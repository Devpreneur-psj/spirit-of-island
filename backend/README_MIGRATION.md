# 데이터베이스 마이그레이션 실행 가이드

## 빠른 시작

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

### 3. 초기 마이그레이션 생성 및 실행

```bash
cd backend

# 마이그레이션 생성
alembic revision --autogenerate -m "Initial migration"

# 데이터베이스 업그레이드
alembic upgrade head
```

### 4. 초기 데이터 생성 (선택사항)

```bash
python init_db.py
python init_items.py
```

## 마이그레이션 명령어

### 마이그레이션 생성

모델을 변경한 후:

```bash
alembic revision --autogenerate -m "Description of changes"
```

### 데이터베이스 업그레이드

```bash
alembic upgrade head
```

### 현재 버전 확인

```bash
alembic current
```

### 마이그레이션 히스토리

```bash
alembic history
```

### 롤백

```bash
alembic downgrade -1
```

## 문제 해결

### 환경 변수를 읽을 수 없는 경우

`.env` 파일이 `backend/` 디렉토리에 있는지 확인하세요.

### 데이터베이스 연결 오류

1. PostgreSQL이 실행 중인지 확인
2. `DATABASE_URL`이 올바른지 확인
3. 데이터베이스 사용자 권한 확인

### 마이그레이션 충돌

여러 브랜치에서 작업한 경우 마이그레이션 파일을 수동으로 병합해야 할 수 있습니다.

