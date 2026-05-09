from fastapi import APIRouter

from app.schemas.promo import PromoRequest, PromoResponse
from app.services.promo import handle_promo_submission

router = APIRouter(prefix="/api", tags=["promo"])


@router.post("/promo", response_model=PromoResponse)
def create_promo(payload: PromoRequest) -> PromoResponse:
    return handle_promo_submission(payload.players, payload.first_on_mic)
