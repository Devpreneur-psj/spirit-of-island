from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """회원가입"""
    print(f"📝 회원가입 요청 받음: {user_data.username}, {user_data.email}")
    
    try:
        # 사용자 이름 중복 확인
        print("🔍 사용자 이름 중복 확인 중...")
        existing_user = db.query(User).filter(User.username == user_data.username).first()
        if existing_user:
            print(f"❌ 이미 존재하는 사용자 이름: {user_data.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 사용자 이름입니다."
            )
        
        # 이메일 중복 확인
        print("🔍 이메일 중복 확인 중...")
        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            print(f"❌ 이미 존재하는 이메일: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 이메일입니다."
            )
        
        # 새 사용자 생성
        print("👤 새 사용자 생성 중...")
        import uuid
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            id=str(uuid.uuid4()),
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            coins=1000
        )
        
        print("💾 데이터베이스에 저장 중...")
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"✅ 회원가입 성공: {new_user.username} (ID: {new_user.id})")
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 회원가입 오류: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회원가입 처리 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """로그인"""
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자 이름 또는 비밀번호가 올바르지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """현재 사용자 정보"""
    return current_user

