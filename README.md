# Aether Island - 마정령 육성 시뮬레이션 게임

구름 위에 떠 있는 마정령의 섬에서 귀여운 마정령을 키우고, 돌보고, 훈련시키고, 대회에 참가시키는 힐링+경쟁 기반 시뮬레이션 게임

## 프로젝트 구조

```
정령의섬/
├── backend/                 # FastAPI 백엔드
│   ├── app/
│   │   ├── api/            # API 엔드포인트
│   │   ├── core/           # 설정, 보안, JWT
│   │   ├── models/         # 데이터베이스 모델
│   │   ├── schemas/        # Pydantic 스키마
│   │   ├── services/       # 비즈니스 로직
│   │   ├── utils/          # 유틸리티 함수
│   │   └── main.py         # FastAPI 앱 진입점
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── stores/         # Zustand 상태 관리
│   │   ├── services/       # API 서비스
│   │   ├── utils/          # 유틸리티 함수
│   │   ├── types/          # TypeScript 타입 정의
│   │   ├── styles/         # 전역 스타일
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── shared/                  # 공통 타입 정의
│   └── types/
│
└── docker-compose.yml       # 개발 환경 설정

```

## 기술 스택

### 백엔드
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- JWT 인증
- Python 3.11+

### 프론트엔드
- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- Zustand
- Axios

## 주요 기능

1. **마정령 캐릭터 시스템**
   - 8가지 속성 (불, 물, 바람, 땅, 식물, 전기, 빛, 어둠)
   - 6가지 스탯 (체력, 민첩, 지능, 친근함, 근성, 운)
   - 다양한 성격
   - 성장 단계 (알→유아→청소년→성체→초월체→노년)

2. **관리 기능**
   - 먹이 주기
   - 놀기
   - 치료
   - 씻기기
   - 능력치 훈련 (미니게임)

3. **아이템 시스템**
   - 사료, 비타민, 장난감, 치료 키트 등

4. **대회 시스템**
   - 경주, 지능 퍼즐, 전투, 코디 대회
   - 시즌 랭킹 및 보상

5. **자율 행동 AI**
   - 배고픔, 기분, 지루함, 날씨, 상태에 따른 자동 행동

## 설치 및 실행

### 백엔드
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

### Docker Compose
```bash
docker-compose up -d
```

## 개발 환경 설정

1. PostgreSQL 설치 및 실행
2. 환경 변수 설정 (.env 파일)
3. 데이터베이스 마이그레이션
4. 백엔드 및 프론트엔드 실행

## 라이선스

MIT

# spirit-of-island
