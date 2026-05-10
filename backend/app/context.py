"""Per-request context for the current promo payload.

Uses contextvars so any function in the call chain (services, prompt
builders, future LLM clients, etc.) can read the active PromoRequest
without it being threaded through every function signature.

ContextVars are async-safe and request-scoped: each incoming request
runs in its own context, so concurrent requests do NOT clobber each
other's payload.
"""

from contextvars import ContextVar

from app.schemas.promo import PromoRequest

_current_promo: ContextVar[PromoRequest | None] = ContextVar(
    "current_promo", default=None
)


def set_current_promo(payload: PromoRequest) -> None:
    """Store the payload for the current request."""
    _current_promo.set(payload)


def get_current_promo() -> PromoRequest:
    """Return the active payload. Raises if called outside a promo request."""
    payload = _current_promo.get()
    if payload is None:
        raise RuntimeError(
            "No active promo payload. get_current_promo() must be called "
            "during a request that has set it via set_current_promo()."
        )
    return payload
