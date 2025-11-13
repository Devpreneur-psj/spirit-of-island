# 데이터베이스 마이그레이션 가이드

## Alembic 마이그레이션 사용법

### 1. 초기 마이그레이션 생성

프로젝트를 처음 설정할 때:

```bash
cd backend
alembic revision --autogenerate -m "Initial migration"
```

또는 스크립트 사용:

```bash
cd backend
python scripts/migrate.py create -m "Initial migration"
```

### 2. 데이터베이스 업그레이드

마이그레이션을 데이터베이스에 적용:

```bash
cd backend
alembic upgrade head
```

또는 스크립트 사용:

```bash
cd backend
python scripts/migrate.py upgrade
```

### 3. 현재 마이그레이션 버전 확인

```bash
cd backend
alembic current
```

또는 스크립트 사용:

```bash
cd backend
python scripts/migrate.py current
```

### 4. 마이그레이션 히스토리 확인

```bash
cd backend
alembic history
```

또는 스크립트 사용:

```bash
cd backend
python scripts/migrate.py history
```

### 5. 데이터베이스 다운그레이드

이전 버전으로 롤백:

```bash
cd backend
alembic downgrade -1
```

또는 스크립트 사용:

```bash
cd backend
python scripts/migrate.py downgrade
```

### 6. 특정 버전으로 이동

```bash
cd backend
alembic upgrade <revision>
alembic downgrade <revision>
```

## 마이그레이션 생성 가이드

### 모델 변경 시

1. 모델 파일 수정 (`app/models/` 디렉토리)
2. 마이그레이션 생성:

```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

3. 생성된 마이그레이션 파일 검토 (`alembic/versions/` 디렉토리)
4. 필요시 마이그레이션 파일 수정
5. 데이터베이스 업그레이드:

```bash
alembic upgrade head
```

## 새로운 모델 추가 시

1. 모델 파일 생성 (`app/models/` 디렉토리)
2. `app/models/__init__.py`에 모델 import 추가
3. 스키마 파일 생성 (`app/schemas/` 디렉토리)
4. 마이그레이션 생성:

```bash
cd backend
alembic revision --autogenerate -m "Add new model"
```

5. 데이터베이스 업그레이드:

```bash
alembic upgrade head
```

## 문제 해결

### 마이그레이션 충돌

여러 브랜치에서 동시에 작업한 경우:

1. 현재 마이그레이션 상태 확인:

```bash
alembic current
```

2. 충돌하는 마이그레이션 파일 확인
3. 수동으로 마이그레이션 파일 수정
4. 새로운 마이그레이션 생성하여 해결

### 데이터베이스 스키마 불일치

1. 데이터베이스 스키마 확인:

```sql
\d+ table_name  -- PostgreSQL
```

2. 모델과 데이터베이스 스키마 비교
3. 필요시 마이그레이션 수정 또는 새로 생성

### 롤백 필요 시

1. 이전 마이그레이션으로 롤백:

```bash
alembic downgrade -1
```

2. 또는 특정 버전으로 롤백:

```bash
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

## 초기 설정

프로젝트를 처음 설정할 때:

1. 환경 변수 설정 (`.env` 파일)
2. 데이터베이스 생성:

```bash
createdb aether_island
```

3. 초기 마이그레이션 생성:

```bash
cd backend
alembic revision --autogenerate -m "Initial migration"
```

4. 데이터베이스 업그레이드:

```bash
alembic upgrade head
```

5. 초기 데이터 생성 (선택사항):

```bash
python init_db.py
python init_items.py
```

