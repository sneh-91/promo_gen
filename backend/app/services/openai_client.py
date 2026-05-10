"""Single shared OpenAI client.

Constructed lazily on first use so:
- Importing app.services.* does not require OPENAI_API_KEY to be set
  (matters for tests, mock paths, and uvicorn boot when the key is wrong).
- The client is still a singleton — one underlying httpx pool reused across
  every request and every worker thread, instead of one client per call.

If the key is missing we raise immediately when someone actually tries to
use the API, so the failure is loud and pointed at the right line.
"""

from functools import lru_cache

from openai import OpenAI

from app.config import settings


@lru_cache(maxsize=1)
def get_openai_client() -> OpenAI:
    if not settings.openai_api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Add it to backend/.env before "
            "calling endpoints that talk to OpenAI."
        )
    return OpenAI(api_key=settings.openai_api_key)
