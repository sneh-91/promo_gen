from fastapi import APIRouter, Depends

from app.context import set_current_promo
from app.schemas.promo import PromoRequest, PromoResponse
from app.services.promo import handle_promo_submission

router = APIRouter(prefix="/api", tags=["promo"])


def load_promo_context(payload: PromoRequest) -> PromoRequest:
    """Dependency: parse the body and publish it to the request context."""
    set_current_promo(payload)
    return payload


@router.post("/promo", response_model=PromoResponse)
def create_promo(payload: PromoRequest = Depends(load_promo_context)) -> PromoResponse:
    return handle_promo_submission()
