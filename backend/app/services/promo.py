"""Promo business logic.

The HTTP layer (routers/promo.py) stays thin and delegates here.
This is where future work like calling an LLM, persisting to a DB,
or fanning out to other services will live.
"""

from app.schemas.promo import Player, PromoResponse


def handle_promo_submission(players: list[Player], first_on_mic: int) -> PromoResponse:
    print("Received promo payload:")
    print(f"  First on mic: Player {first_on_mic}")
    for i, player in enumerate(players, start=1):
        print(f"  Player {i}: {player.model_dump()}")

    return PromoResponse(status="received", player_count=len(players))
