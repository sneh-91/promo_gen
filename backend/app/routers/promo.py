from fastapi import APIRouter, Depends

from app.context import set_current_promo
from app.schemas.promo import JudgeRequest, JudgeResponse, PromoRequest, PromoResponse
from app.services.access import require_access_key
from app.services.promo import handle_judge_submission, handle_promo_submission

router = APIRouter(prefix="/api", tags=["promo"])


@router.post("/promo", response_model=PromoResponse)
def create_promo(
    payload: PromoRequest,
    _: None = Depends(require_access_key),
) -> PromoResponse:
    set_current_promo(payload)
    return handle_promo_submission()


@router.post("/judge", response_model=JudgeResponse)
def judge_promo(
    payload: JudgeRequest,
    _: None = Depends(require_access_key),
) -> JudgeResponse:
    return handle_judge_submission(payload)
