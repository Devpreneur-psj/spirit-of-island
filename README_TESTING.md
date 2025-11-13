# 테스트 가이드

## 백엔드 테스트

### 설정

백엔드 테스트는 Pytest를 사용합니다. `conftest.py`에서 공통 fixtures를 정의합니다.

### 테스트 실행

```bash
cd backend

# 모든 테스트 실행
pytest

# 특정 테스트 파일 실행
pytest tests/test_auth.py

# 커버리지 포함
pytest --cov=app --cov-report=html

# 상세 출력
pytest -v
```

### 테스트 구조

- `tests/conftest.py`: 공통 fixtures (db, test_user, client)
- `tests/test_auth.py`: 인증 테스트
- `tests/test_spiritlings.py`: 마정령 테스트
- `tests/test_items.py`: 아이템 테스트
- `tests/test_competitions.py`: 대회 테스트

### 테스트 작성 가이드

1. **Fixture 사용**: `conftest.py`에서 제공하는 fixtures 사용
2. **테스트 격리**: 각 테스트는 독립적으로 실행되어야 함
3. **데이터베이스**: 테스트용 SQLite 메모리 데이터베이스 사용

## 프론트엔드 테스트

### 설정

프론트엔드 테스트는 Jest와 React Testing Library를 사용합니다.

### 테스트 실행

```bash
cd frontend

# 모든 테스트 실행
npm test

# Watch 모드
npm run test:watch

# 커버리지 포함
npm run test:coverage
```

### 테스트 구조

- `src/__tests__/components/`: 컴포넌트 테스트
- `src/__tests__/services/`: 서비스 테스트
- `src/__tests__/stores/`: 스토어 테스트

### 테스트 작성 가이드

1. **컴포넌트 테스트**: `@testing-library/react` 사용
2. **Mock 사용**: `jest.mock()`로 서비스 및 스토어 모킹
3. **사용자 이벤트**: `@testing-library/user-event` 사용

## 테스트 커버리지

### 백엔드 커버리지

```bash
cd backend
pytest --cov=app --cov-report=html
```

커버리지 리포트는 `htmlcov/index.html`에 생성됩니다.

### 프론트엔드 커버리지

```bash
cd frontend
npm run test:coverage
```

커버리지 리포트는 `coverage/` 디렉토리에 생성됩니다.

## CI/CD 테스트

GitHub Actions에서 자동으로 테스트를 실행합니다:

```yaml
# .github/workflows/ci.yml
- name: Run backend tests
  run: |
    cd backend
    pytest

- name: Run frontend tests
  run: |
    cd frontend
    npm test
```

## 문제 해결

### 테스트 실패

1. 데이터베이스 연결 확인
2. 환경 변수 확인
3. 의존성 설치 확인

### 커버리지 부족

1. 누락된 테스트 케이스 추가
2. 엣지 케이스 테스트
3. 에러 처리 테스트

