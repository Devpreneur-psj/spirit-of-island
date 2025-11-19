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
    print("🚀 FastAPI 애플리케이션 시작 중...")
    
    # 데이터베이스 연결 테스트 (실패해도 서버는 시작)
    try:
        from app.core.database import test_db_connection
        test_db_connection()
    except Exception as e:
        print(f"⚠️ 데이터베이스 연결 확인 중 오류 (서버는 계속 시작됩니다): {e}")
    
    # 백그라운드 프로세서 시작
    print("마정령 자율 행동 AI 백그라운드 프로세서를 시작합니다...")
    try:
        # 백그라운드 프로세서를 별도 스레드에서 시작 (비동기로 처리)
        import threading
        processor_thread = threading.Thread(target=start_background_processor, daemon=True)
        processor_thread.start()
        print("✅ 백그라운드 프로세서 시작 완료")
    except Exception as e:
        print(f"⚠️ 백그라운드 프로세서 시작 실패 (계속 진행): {e}")
    
    print("✅ FastAPI 서버가 포트 8000에서 시작되었습니다!")
    print("📡 API 문서: http://localhost:8000/docs")
    print("🏥 Health check: http://localhost:8000/health")
    
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
    allow_origins=settings.cors_origins_list,
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
    print("🏥 Health check 요청 받음")
    try:
        # 데이터베이스 연결 확인
        from app.core.database import SessionLocal
        from sqlalchemy import text
        db = SessionLocal()
        try:
            db.execute(text("SELECT 1"))
            print("✅ Health check 성공 (DB 연결 정상)")
            return {"status": "healthy", "database": "connected"}
        finally:
            db.close()
    except Exception as e:
        print(f"❌ Health check 실패: {e}")
        return {"status": "unhealthy", "error": str(e)}

