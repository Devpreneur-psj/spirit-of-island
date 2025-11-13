"""
Alembic 마이그레이션 생성 및 실행 스크립트
"""
import os
import sys
from pathlib import Path

# 프로젝트 루트 경로 추가
backend_path = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_path))

os.chdir(backend_path)


def create_initial_migration():
    """초기 마이그레이션 생성"""
    print("초기 마이그레이션 생성 중...")
    os.system("alembic revision --autogenerate -m 'Initial migration'")


def upgrade_database():
    """데이터베이스 업그레이드"""
    print("데이터베이스 업그레이드 중...")
    os.system("alembic upgrade head")


def downgrade_database():
    """데이터베이스 다운그레이드"""
    print("데이터베이스 다운그레이드 중...")
    os.system("alembic downgrade -1")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Alembic 마이그레이션 관리")
    parser.add_argument(
        "action",
        choices=["create", "upgrade", "downgrade"],
        help="실행할 액션"
    )
    
    args = parser.parse_args()
    
    if args.action == "create":
        create_initial_migration()
    elif args.action == "upgrade":
        upgrade_database()
    elif args.action == "downgrade":
        downgrade_database()

