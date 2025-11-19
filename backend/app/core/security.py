from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings
import bcrypt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """비밀번호 검증"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """비밀번호 해시"""
    # bcrypt는 최대 72바이트까지만 처리 가능
    # passlib이 내부적으로 bcrypt를 사용하므로, 바이트 단위로 잘라낸 후 해시
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            # 72바이트로 잘라냄
            password_bytes = password_bytes[:72]
        # bcrypt는 바이트를 직접 받을 수 있으므로, 바이트로 전달
        # passlib은 문자열을 받지만 내부적으로 바이트로 변환하므로, 안전하게 처리
        password_str = password_bytes.decode('utf-8', errors='ignore')
        # passlib이 사용하는 bcrypt의 바이트 제한을 피하기 위해 직접 bcrypt 사용 후 변환
        try:
            hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
            # passlib 형식으로 변환 (bcrypt 해시는 이미 문자열로 변환 가능)
            return hashed_bytes.decode('utf-8')
        except Exception:
            # 실패 시 passlib 사용 (이미 잘린 password_str 사용)
            return pwd_context.hash(password_str)
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """JWT 액세스 토큰 생성"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """JWT 토큰 디코딩"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

