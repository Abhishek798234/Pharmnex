from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # App
    APP_NAME: str = "PharmnEx API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database (Defaults to SQLite for instant local execution, override with PostgreSQL in .env)
    DATABASE_URL: str = "sqlite+aiosqlite:///./pharmnex.db"
    DATABASE_URL_SYNC: str = "sqlite:///./pharmnex.db"

    # JWT
    SECRET_KEY: str = "pharmnex-super-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Algorand
    ALGORAND_NETWORK: str = "testnet"
    ALGORAND_ALGOD_ADDRESS: str = "https://testnet-api.algonode.cloud"
    ALGORAND_INDEXER_ADDRESS: str = "https://testnet-idx.algonode.cloud"
    ALGORAND_ADMIN_MNEMONIC: str = ""
    USE_ALGORAND_MOCK: bool = True  # Set False when AlgoKit is configured

    # MLflow
    MLFLOW_TRACKING_URI: str = "http://localhost:5000"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
