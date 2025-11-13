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
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173"
    ).split(",")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

