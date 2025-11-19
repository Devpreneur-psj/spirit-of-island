# Aether Island Backend (Spring Boot)

## 요구사항

- Java 17 이상
- Maven 3.6 이상
- PostgreSQL 15 이상

## 빌드 및 실행

```bash
# 빌드
mvn clean package

# 실행
mvn spring-boot:run

# 또는 JAR 파일 실행
java -jar target/aether-island-backend-1.0.0.jar
```

## 환경 변수

`src/main/resources/application.properties` 파일을 수정하거나 환경 변수로 설정:

- `spring.datasource.url`: 데이터베이스 URL
- `spring.datasource.username`: 데이터베이스 사용자명
- `spring.datasource.password`: 데이터베이스 비밀번호
- `jwt.secret`: JWT 시크릿 키
- `jwt.expiration`: JWT 만료 시간 (밀리초)

## API 엔드포인트

- `POST /api/v1/auth/register`: 회원가입
- `POST /api/v1/auth/login`: 로그인
- `GET /api/v1/auth/me`: 현재 사용자 정보
- `GET /health`: Health check
- `GET /`: API 정보

