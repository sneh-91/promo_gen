"""Promo business logic.

The HTTP layer (routers/promo.py) stays thin and delegates here.
This is where future work like calling an LLM, persisting to a DB,
or fanning out to other services will live.

Helpers here pull the active payload from app.context instead of
taking it as a parameter, so deep call chains stay clean.
"""

from openai import OpenAI

from app.config import settings
from app.context import get_current_promo
from app.prompts.prompts import prompts
from app.schemas.promo import PromoResponse
from app.schemas.wrestler import Wrestler

client = OpenAI(api_key=settings.openai_api_key)



def handle_promo_submission() -> PromoResponse:
    payload = get_current_promo()

    print("Received promo payload:")
    print(f"  First on mic: Player {payload.first_on_mic}")
    for i, player in enumerate(payload.players, start=1):
        print(f"  Player {i}: {player.model_dump()}")

    transcript = generate_promo_response()

    return PromoResponse(transcript=transcript)


def generate_promo_response():
    payload = get_current_promo()
    p1, p2 = payload.players[0], payload.players[1]

    WRESTLER_1 = Wrestler(
        name=p1.name,
        alignment=p1.alignment,
        size=p1.size,
        look=p1.look,
        description=p1.description,
        opponent=p2,
        model_name=settings.openai_model,
        system_prompt=prompts[p1.alignment],
        client=client,
    )
    WRESTLER_2 = Wrestler(
        name=p2.name,
        alignment=p2.alignment,
        size=p2.size,
        look=p2.look,
        description=p2.description,
        opponent=p1,
        model_name=settings.openai_model,
        system_prompt=prompts[p2.alignment],
        client=client,
    )
    wrestlers_in_order = (
        [WRESTLER_1, WRESTLER_2] if payload.first_on_mic == 1 else [WRESTLER_2, WRESTLER_1]
    )

    TOTAL_TURNS = 6
    promo_responses = []
    promo_history = ""

    for turn_idx in range(TOTAL_TURNS):
        speaker = wrestlers_in_order[turn_idx % 2]
        response_text = speaker.generate_promo(promo_history)
        promo_responses.append({
            "wrestler": speaker.name,
            "response": response_text,
        })
        promo_history += f"{speaker.name}: {response_text}\n\n"

    return promo_responses


def generate_mock_promo_response():
    """Same shape as generate_promo_response(), no OpenAI calls.

    Uses real wrestler names from the active payload and respects
    first_on_mic, so the frontend gets realistic-looking data to render
    while iterating on UI without burning API quota.

    Swap manually with generate_promo_response() when you want the real thing.
    """
    payload = get_current_promo()
    wrestlers_in_order = (
        [payload.players[0], payload.players[1]]
        if payload.first_on_mic == 1
        else [payload.players[1], payload.players[0]]
    )

    mock_lines = [
        "This is my house. Tonight, the lights are on me, the crowd is mine, and you... you're just a name on the marquee. I didn't crawl through ten years of dirt and broken bones to share a ring with someone who thinks they belong here. Welcome to the deep end.",
        "Your house? Your house? I've been knocking down doors while you were still asking permission. The crowd doesn't owe you a damn thing — and neither do I. So save the speech, because the only marquee I see tonight has my name carved on top of yours.",
        "Cute. Real cute. You've got the lines memorized like a kid on his first day of drama class. But scripts don't win matches, kid. Heart does. Pain does. And from where I'm standing, you've got neither.",
        "Pain? You wanna talk pain? I've taken hits from men twice your size and walked out smiling. The only thing keeping you in this business is the volume on the entrance music. Cut it off and you're nothing.",
        "Then prove it. Stop running your mouth and put hands on me. Or is that not in the script either? Because I'm starting to think the only thing you can deliver... is excuses.",
        "Big talk for somebody about to find out what I do for a living. Bell rings. Music cuts. We see who's still standing. Game on.",
    ]

    return [
        {"wrestler": wrestlers_in_order[i % 2].name, "response": line}
        for i, line in enumerate(mock_lines)
    ]


