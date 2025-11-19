from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://aether:aether123@localhost:5432/aether_island"
    )
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "dev-secret-key-change-in-production-please-use-a-strong-random-string"
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173"
    )
    PYTHON_ENV: str = os.getenv("PYTHON_ENV", "development")

    @property
    def cors_origins_list(self) -> List[str]:
        """CORS origins를 리스트로 변환"""
        origins = [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        # 기본값이 비어있지 않도록 보장
        if not origins:
            origins = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8000"]
        return origins

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # .env 파일의 추가 필드 무시


settings = Settings()

