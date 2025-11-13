from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.v1.router import api_router
from app.services.spiritling_ai import start_background_processor


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 생명주기 관리"""
    # 시작 시
    print("마정령 자율 행동 AI 백그라운드 프로세서를 시작합니다...")
    start_background_processor()
    yield
    # 종료 시
    print("애플리케이션이 종료됩니다.")


app = FastAPI(
    title="Aether Island API",
    description="마정령 육성 시뮬레이션 게임 API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Aether Island API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

