import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from threading import Lock

from fastapi import HTTPException, status

from app.config import settings

_DB_LOCK = Lock()


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.usage_db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def _ensure_schema(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS promo_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kind TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _day_start_iso(now: datetime) -> str:
    return now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()


def _month_start_iso(now: datetime) -> str:
    return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()


def enforce_promo_quota() -> None:
    now = _utc_now()
    day_start = _day_start_iso(now)
    month_start = _month_start_iso(now)

    with _DB_LOCK, closing(_connect()) as conn:
        _ensure_schema(conn)
        day_count = conn.execute(
            """
            SELECT COUNT(*) FROM promo_runs
            WHERE kind = 'promo' AND status = 'success' AND created_at >= ?
            """,
            (day_start,),
        ).fetchone()[0]
        if day_count >= settings.daily_promo_limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Daily promo limit reached. Try again tomorrow.",
            )

        month_count = conn.execute(
            """
            SELECT COUNT(*) FROM promo_runs
            WHERE kind = 'promo' AND status = 'success' AND created_at >= ?
            """,
            (month_start,),
        ).fetchone()[0]
        if month_count >= settings.monthly_promo_limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Monthly promo limit reached. Try again next month.",
            )


def record_successful_promo_run() -> None:
    with _DB_LOCK, closing(_connect()) as conn:
        _ensure_schema(conn)
        conn.execute(
            """
            INSERT INTO promo_runs (kind, status, created_at)
            VALUES (?, ?, ?)
            """,
            ("promo", "success", _utc_now().isoformat()),
        )
        conn.commit()
