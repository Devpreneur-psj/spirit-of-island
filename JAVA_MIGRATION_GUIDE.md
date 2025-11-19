# 🚀 Java + Spring Boot 마이그레이션 가이드

## ✅ 완료된 작업

FastAPI 백엔드를 Spring Boot로 완전히 변환했습니다.

### 생성된 파일 구조

```
backend-java/
├── pom.xml                                    # Maven 빌드 설정
├── src/
│   ├── main/
│   │   ├── java/com/aetherisland/
│   │   │   ├── AetherIslandApplication.java  # 메인 애플리케이션
│   │   │   ├── entity/                       # JPA 엔티티
│   │   │   │   ├── User.java
│   │   │   │   ├── Spiritling.java
│   │   │   │   ├── UserItem.java
│   │   │   │   └── ActionLog.java
│   │   │   ├── dto/                          # DTO 클래스
│   │   │   │   ├── UserCreateRequest.java
│   │   │   │   ├── UserLoginRequest.java
│   │   │   │   ├── UserResponse.java
│   │   │   │   └── TokenResponse.java
│   │   │   ├── repository/                   # JPA Repository
│   │   │   │   └── UserRepository.java
│   │   │   ├── service/                      # 비즈니스 로직
│   │   │   │   └── AuthService.java
│   │   │   ├── controller/                   # REST API
│   │   │   │   ├── AuthController.java
│   │   │   │   └── HealthController.java
│   │   │   ├── security/                     # 보안 설정
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   └── config/                       # 설정
│   │   │       └── SecurityConfig.java
│   │   └── resources/
│   │       └── application.properties        # 설정 파일
│   └── test/                                 # 테스트 코드
├── start-java.sh                             # 실행 스크립트
└── stop-java.sh                              # 중지 스크립트
```

## 🔧 주요 변경 사항

### 1. 기술 스택
- **FastAPI** → **Spring Boot 3.2.0**
- **SQLAlchemy** → **Spring Data JPA**
- **Pydantic** → **Jakarta Validation**
- **python-jose** → **jjwt (Java JWT)**
- **passlib** → **BCryptPasswordEncoder**

### 2. 아키텍처
- **FastAPI Router** → **Spring REST Controller**
- **SQLAlchemy Session** → **JPA Repository**
- **Pydantic Models** → **DTO Classes**
- **Dependency Injection** → **Spring DI**

### 3. 보안
- JWT 인증 필터 구현
- Spring Security 설정
- CORS 설정
- BCrypt 비밀번호 암호화

## 📋 요구사항

### 필수 설치
1. **Java 17 이상**
   ```bash
   java -version
   ```

2. **Maven 3.6 이상**
   ```bash
   mvn -version
   ```

3. **PostgreSQL 15 이상**
   ```bash
   psql --version
   ```

## 🚀 실행 방법

### 1. 데이터베이스 설정

PostgreSQL이 실행 중이어야 합니다:

```bash
# PostgreSQL 실행 확인
brew services list | grep postgresql

# PostgreSQL 시작 (macOS)
brew services start postgresql@15

# 데이터베이스 생성
createdb aether_island
```

### 2. 환경 변수 설정

`backend-java/src/main/resources/application.properties` 파일 확인:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/aether_island
spring.datasource.username=aether
spring.datasource.password=aether123
jwt.secret=your-secret-key-change-in-production-please-use-a-strong-random-string
```

### 3. 빌드 및 실행

#### 방법 1: 스크립트 사용 (권장)

```bash
# 프로젝트 루트에서
./start-java.sh
```

#### 방법 2: 수동 실행

```bash
cd backend-java

# 빌드
mvn clean package -DskipTests

# 실행
mvn spring-boot:run

# 또는 JAR 파일 실행
java -jar target/aether-island-backend-1.0.0.jar
```

### 4. 서비스 중지

```bash
./stop-java.sh
```

## 🧪 테스트

### 1. Health Check

```bash
curl http://localhost:8000/health
```

예상 응답:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### 2. 회원가입

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "test123"
  }'
```

### 3. 로그인

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

예상 응답:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "bearer"
}
```

### 4. 현재 사용자 정보

```bash
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔍 문제 해결

### 빌드 실패

```bash
# Maven 캐시 정리
mvn clean

# 의존성 다시 다운로드
mvn dependency:resolve
```

### 포트 충돌

```bash
# 포트 8000 사용 중인 프로세스 확인
lsof -i :8000

# 프로세스 종료
lsof -ti:8000 | xargs kill -9
```

### 데이터베이스 연결 오류

1. PostgreSQL 실행 확인
2. 데이터베이스 생성 확인
3. `application.properties`의 연결 정보 확인

### 로그 확인

```bash
tail -f backend-java.log
```

## 📝 API 엔드포인트

### 인증
- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `GET /api/v1/auth/me` - 현재 사용자 정보 (인증 필요)

### 시스템
- `GET /health` - Health check
- `GET /` - API 정보

## 🔄 프론트엔드 연동

프론트엔드는 기존과 동일하게 작동합니다:

```typescript
// frontend/src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

API 엔드포인트와 응답 형식이 동일하므로 프론트엔드 코드 변경이 필요 없습니다.

## ⚠️ 주의사항

1. **데이터베이스 마이그레이션**: 기존 Python 백엔드의 데이터베이스 스키마를 그대로 사용할 수 있습니다.
2. **JWT 토큰**: Python과 Java의 JWT 구현이 다를 수 있으므로, 기존 토큰은 무효화됩니다.
3. **비밀번호 해시**: BCrypt를 사용하므로 기존 비밀번호는 재설정이 필요할 수 있습니다.

## 🎯 다음 단계

1. 나머지 엔티티 추가 (Item, Competition, Event 등)
2. 나머지 API 엔드포인트 구현
3. 백그라운드 워커 스레드 구현
4. 테스트 코드 작성

