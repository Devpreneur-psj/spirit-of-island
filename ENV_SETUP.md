# 환경 변수 설정 가이드

## 백엔드 환경 변수 설정

### 1. `.env` 파일 생성

`backend/` 디렉토리에 `.env` 파일을 생성하세요:

```bash
cd backend
cp env.example .env
```

### 2. `.env` 파일 내용 수정

`backend/.env` 파일을 열어 다음 내용을 수정하세요:

```env
# Database
DATABASE_URL=postgresql://aether:aether123@localhost:5432/aether_island

# JWT Authentication
JWT_SECRET_KEY=your-secret-key-change-in-production-please-use-a-strong-random-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Environment
PYTHON_ENV=development
```

### 3. 프로덕션 환경 변수

프로덕션 환경에서는 다음 사항을 반드시 변경하세요:

- `JWT_SECRET_KEY`: 강력한 랜덤 문자열로 변경 (최소 32자)
- `DATABASE_URL`: 프로덕션 데이터베이스 URL로 변경
- `PYTHON_ENV`: `production`으로 변경

### 4. JWT Secret Key 생성

강력한 JWT Secret Key를 생성하려면:

```bash
# Linux/macOS
openssl rand -hex 32

# 또는 Python 사용
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 프론트엔드 환경 변수 설정

### 1. `.env` 파일 생성

`frontend/` 디렉토리에 `.env` 파일을 생성하세요:

```bash
cd frontend
cp env.example .env
```

### 2. `.env` 파일 내용 수정

`frontend/.env` 파일을 열어 다음 내용을 수정하세요:

```env
# API URL
VITE_API_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

### 3. 프로덕션 환경 변수

프로덕션 환경에서는 `VITE_API_URL`을 프로덕션 API URL로 변경하세요.

## Docker Compose 환경 변수

Docker Compose를 사용하는 경우, 프로젝트 루트에 `.env` 파일을 생성할 수 있습니다:

```env
# Backend
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
PYTHON_ENV=development

# Frontend
VITE_API_URL=http://localhost:8000
NODE_ENV=development
```

## 보안 주의사항

1. **`.env` 파일은 절대 Git에 커밋하지 마세요**
   - `.gitignore`에 `.env` 파일이 포함되어 있는지 확인하세요
   - `.env.example` 파일만 커밋하세요

2. **프로덕션 환경 변수**
   - 프로덕션에서는 환경 변수를 안전하게 관리하세요
   - Kubernetes Secret, AWS Secrets Manager 등을 사용하세요

3. **JWT Secret Key**
   - 개발 환경과 프로덕션 환경에서 다른 키를 사용하세요
   - 키를 정기적으로 로테이션하세요

## 문제 해결

### 환경 변수를 읽을 수 없는 경우

1. `.env` 파일이 올바른 위치에 있는지 확인하세요
2. `.env` 파일의 형식이 올바른지 확인하세요 (공백 없이 `KEY=value` 형식)
3. 애플리케이션을 재시작하세요

### 데이터베이스 연결 오류

1. `DATABASE_URL`이 올바른지 확인하세요
2. PostgreSQL이 실행 중인지 확인하세요
3. 데이터베이스 사용자 권한을 확인하세요

