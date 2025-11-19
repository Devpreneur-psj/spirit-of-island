from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

print(f"🔗 데이터베이스 연결 설정: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else '***'}")

# 엔진 생성 (lazy connection - 실제 연결은 필요할 때만 수행)
# pool_pre_ping=True로 설정하여 연결 전 자동으로 ping 확인
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # 연결 전 ping 확인 (자동 재연결)
    pool_recycle=3600,   # 1시간마다 연결 재활용
    pool_size=5,         # 연결 풀 크기
    max_overflow=10,     # 추가 연결 허용
    echo=False,
    connect_args={
        "connect_timeout": 5,  # 연결 타임아웃 5초
    } if "postgresql" in settings.DATABASE_URL else {}
)

# 모듈 로드 시 즉시 연결 테스트하지 않음 (서버 시작을 블로킹하지 않음)
# 실제 연결은 첫 요청 시 pool_pre_ping이 자동으로 처리

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """데이터베이스 세션 의존성"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_db_connection():
    """데이터베이스 연결 테스트 (선택적, 필요시 호출)"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ 데이터베이스 연결 성공")
        return True
    except Exception as e:
        print(f"⚠️ 데이터베이스 연결 실패: {e}")
        return False

