"""Promo business logic.

The HTTP layer (routers/promo.py) stays thin and delegates here.
This is where future work like calling an LLM, persisting to a DB,
or fanning out to other services will live.

Helpers here pull the active payload from app.context instead of
taking it as a parameter, so deep call chains stay clean.
"""

from concurrent.futures import ThreadPoolExecutor

from app.config import settings
from app.context import get_current_promo
from app.prompts.prompts import prompts
from app.schemas.promo import Player, PromoResponse
from app.services.openai_client import get_openai_client
from app.services.wrestler import Wrestler

PORTRAIT_MODEL = "gpt-image-2"
PORTRAIT_QUALITY = "low"
PORTRAIT_SIZE = "1024x1536"

_PORTRAIT_VIBE = {
    "heel": "menacing, contemptuous expression, predatory body language, sneer",
    "babyface": "intense, defiant, fired-up expression, ready for war",
    "tweener": "cold, unreadable, calculated expression, dead-eyed stare",
}



def handle_promo_submission() -> PromoResponse:
    payload = get_current_promo()

    print("Received promo payload:")
    print(f"  First on mic: Player {payload.first_on_mic}")
    for i, player in enumerate(payload.players, start=1):
        print(f"  Player {i}: {player.model_dump()}")

    transcript, portrait_1, portrait_2 = generate_promo_response()

    return PromoResponse(
        transcript=transcript,
        portrait_1=portrait_1,
        portrait_2=portrait_2,
    )


def generate_portrait(player: Player) -> str | None:
    """Generate a single wrestler portrait. Returns a data URL or None on failure."""
    vibe = _PORTRAIT_VIBE.get(player.alignment, "intense, fired-up expression")
    prompt = (
        f"Full-body professional wrestler promo portrait of {player.name}. "
        f"{player.look}. "
        f"{vibe}. "
        "Standing alone in a dark, fog-filled arena under a single dramatic overhead "
        "spotlight, with red and gold rim lighting from behind, smoke at floor level, "
        "and the suggestion of a wrestling ring fading into the shadows. "
        "Vertical composition, wrestler centered and full body in frame from head to "
        "mid-thigh. Cinematic 35mm film, high contrast, dramatic shadows, photorealistic. "
        "No on-screen text, no logos, no watermarks, no captions."
    )
    try:
        result = get_openai_client().images.generate(
            model=PORTRAIT_MODEL,
            prompt=prompt,
            size=PORTRAIT_SIZE,
            quality=PORTRAIT_QUALITY,
            n=1,
        )
        b64 = result.data[0].b64_json
        return f"data:image/png;base64,{b64}"
    except Exception as exc:
        print(f"Portrait generation failed for {player.name}: {exc}")
        return None


def generate_promo_response():
    payload = get_current_promo()
    p1, p2 = payload.players[0], payload.players[1]
    openai_client = get_openai_client()

    WRESTLER_1 = Wrestler(
        name=p1.name,
        alignment=p1.alignment,
        size=p1.size,
        look=p1.look,
        description=p1.description,
        opponent=p2,
        model_name=settings.openai_model,
        system_prompt=prompts[p1.alignment],
        client=openai_client,
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
        client=openai_client,
    )
    wrestlers_in_order = (
        [WRESTLER_1, WRESTLER_2] if payload.first_on_mic == 1 else [WRESTLER_2, WRESTLER_1]
    )

    TOTAL_TURNS = 6
    promo_responses = []
    promo_history = ""

    # Portraits generate in parallel with the turn loop so the two slowest paths
    # (portrait calls and the sequential turn calls) overlap instead of stacking.
    with ThreadPoolExecutor(max_workers=2) as portrait_pool:
        portrait_1_future = portrait_pool.submit(generate_portrait, p1)
        portrait_2_future = portrait_pool.submit(generate_portrait, p2)

        for turn_idx in range(TOTAL_TURNS):
            speaker = wrestlers_in_order[turn_idx % 2]
            response_text = speaker.generate_promo(promo_history)
            promo_responses.append({
                "wrestler": speaker.name,
                "response": response_text,
            })
            promo_history += f"{speaker.name}: {response_text}\n\n"

        portrait_1 = portrait_1_future.result()
        portrait_2 = portrait_2_future.result()

    return promo_responses, portrait_1, portrait_2


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

    transcript = [
        {"wrestler": wrestlers_in_order[i % 2].name, "response": line}
        for i, line in enumerate(mock_lines)
    ]
    return transcript, None, None


