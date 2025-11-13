"""
관리자 계정 생성 스크립트
"""
import sys
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def create_admin(username: str, email: str, password: str):
    """관리자 계정 생성"""
    db = SessionLocal()
    try:
        # 기존 사용자 확인
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"사용자 '{username}'가 이미 존재합니다.")
            return
        
        # 새 사용자 생성
        import uuid
        hashed_password = get_password_hash(password)
        new_user = User(
            id=str(uuid.uuid4()),
            username=username,
            email=email,
            hashed_password=hashed_password,
            coins=10000
        )
        
        db.add(new_user)
        db.commit()
        print(f"관리자 계정 '{username}' 생성 완료!")
    except Exception as e:
        print(f"오류 발생: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("사용법: python create_admin.py <username> <email> <password>")
        sys.exit(1)
    
    username = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    create_admin(username, email, password)

