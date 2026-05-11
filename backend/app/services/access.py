import hmac

from fastapi import Header, HTTPException, status

from app.config import settings


def require_access_key(
    x_app_access_key: str | None = Header(default=None, alias="X-App-Access-Key"),
) -> None:
    expected = settings.app_access_key
    if not expected:
        return

    if not x_app_access_key or not hmac.compare_digest(x_app_access_key, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access key.",
        )
