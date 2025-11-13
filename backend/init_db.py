"""
데이터베이스 초기화 스크립트
"""
from app.core.database import engine, Base
from app.models import *  # 모든 모델 import


def init_db():
    """데이터베이스 테이블 생성"""
    Base.metadata.create_all(bind=engine)
    print("데이터베이스 초기화 완료!")


if __name__ == "__main__":
    init_db()

