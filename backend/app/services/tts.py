import base64

from app.config import settings
from app.schemas.promo import Alignment, Voice
from app.services.openai_client import get_openai_client
from app.services.voice_style import VOICE_STYLE_LABELS, VOICE_STYLE_PROMPTS

TTS_RESPONSE_FORMAT = "mp3"

_VOICE_INSTRUCTIONS: dict[Alignment, str] = {
    "babyface": (
        "Deliver this like a fired-up live wrestling promo. Sound confident, intense, "
        "and crowd-ready without becoming theatrical."
    ),
    "tweener": (
        "Deliver this like a blunt, controlled live wrestling promo. Sound cold, dry, "
        "and measured with restrained menace."
    ),
    "heel": (
        "Deliver this like a terrifying live wrestling promo villain. Sound venomous, "
        "sadistic, theatrical, and predatory. Let the voice signal cruelty, menace, "
        "and total control, like someone enjoying the fear they create. Use sharper "
        "emphasis, darker color, and a more dangerous cadence without becoming cartoonish."
    ),
}


def generate_turn_audio(text: str, voice: Voice, alignment: Alignment) -> tuple[str | None, str | None]:
    try:
        voice_style_label = VOICE_STYLE_LABELS[voice]
        voice_style_prompt = VOICE_STYLE_PROMPTS[voice]
        alignment_instruction = _VOICE_INSTRUCTIONS.get(alignment, "")
        response = get_openai_client().audio.speech.create(
            model=settings.openai_tts_model,
            voice=voice,
            input=text,
            instructions=(
                f"Selected voice style: {voice_style_label}. {voice_style_prompt} "
                f"{alignment_instruction}"
            ).strip(),
            response_format=TTS_RESPONSE_FORMAT,
        )
        audio_b64 = base64.b64encode(response.content).decode("ascii")
        return audio_b64, TTS_RESPONSE_FORMAT
    except Exception as exc:
        print(f"TTS generation failed for voice {voice}: {exc}")
        return None, None
