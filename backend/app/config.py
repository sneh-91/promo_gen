"""Application settings.

Pulls from environment variables (and an optional .env file at the
backend/ root). Add new tunables here so the rest of the app stays
free of os.getenv calls.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    cors_origins: list[str] = ["*"]

    openai_api_key: str | None = None
    openai_model: str = "gpt-5.4-nano"


settings = Settings()
