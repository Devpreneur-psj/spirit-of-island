#!/usr/bin/env python3
"""
Alembic 마이그레이션 실행 스크립트
"""
import os
import sys
import subprocess
from pathlib import Path

# 프로젝트 루트 경로
backend_path = Path(__file__).resolve().parents[1]
os.chdir(backend_path)


def run_command(command):
    """명령어 실행"""
    print(f"실행 중: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        if result.stderr:
            print(f"오류: {result.stderr}")
        sys.exit(1)
    return result.stdout


def create_migration(message="Auto migration"):
    """마이그레이션 생성"""
    print(f"마이그레이션 생성: {message}")
    run_command(f'alembic revision --autogenerate -m "{message}"')


def upgrade_database(revision="head"):
    """데이터베이스 업그레이드"""
    print(f"데이터베이스 업그레이드: {revision}")
    run_command(f"alembic upgrade {revision}")


def downgrade_database(revision="-1"):
    """데이터베이스 다운그레이드"""
    print(f"데이터베이스 다운그레이드: {revision}")
    run_command(f"alembic downgrade {revision}")


def show_current_revision():
    """현재 마이그레이션 버전 확인"""
    print("현재 마이그레이션 버전:")
    run_command("alembic current")


def show_history():
    """마이그레이션 히스토리 확인"""
    print("마이그레이션 히스토리:")
    run_command("alembic history")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Alembic 마이그레이션 관리")
    parser.add_argument(
        "action",
        choices=["create", "upgrade", "downgrade", "current", "history"],
        help="실행할 액션"
    )
    parser.add_argument(
        "-m", "--message",
        help="마이그레이션 메시지 (create 액션에만 사용)"
    )
    parser.add_argument(
        "-r", "--revision",
        help="마이그레이션 버전 (upgrade/downgrade 액션에만 사용)"
    )
    
    args = parser.parse_args()
    
    if args.action == "create":
        message = args.message or "Auto migration"
        create_migration(message)
    elif args.action == "upgrade":
        revision = args.revision or "head"
        upgrade_database(revision)
    elif args.action == "downgrade":
        revision = args.revision or "-1"
        downgrade_database(revision)
    elif args.action == "current":
        show_current_revision()
    elif args.action == "history":
        show_history()

