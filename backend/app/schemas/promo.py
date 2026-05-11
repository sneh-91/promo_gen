from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

Alignment = Literal["babyface", "tweener", "heel"]
Size = Literal["small", "average", "big", "giant"]
Voice = Literal["alloy", "ash", "coral", "sage", "verse"]

# Trim incoming whitespace and reject empty / whitespace-only strings up front,
# so a direct API caller can't bypass the frontend's trim() check.
NameStr = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=60)
]
LookStr = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=800)
]
DescriptionStr = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=2500)
]


class Player(BaseModel):
    name: NameStr
    alignment: Alignment
    size: Size
    voice: Voice
    look: LookStr
    description: DescriptionStr


class PromoRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    players: list[Player] = Field(..., min_length=2, max_length=2)
    first_on_mic: Literal[1, 2] = Field(..., alias="firstOnMic")


class PromoTurn(BaseModel):
    wrestler: str
    response: str
    voice: Voice
    audio_base64: str | None = None
    audio_format: Literal["mp3"] | None = None


class PromoResponse(BaseModel):
    transcript: list[PromoTurn]
    portrait_1: str | None = None
    portrait_2: str | None = None


class JudgeRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    players: list[Player] = Field(..., min_length=2, max_length=2)
    transcript: list[PromoTurn] = Field(..., min_length=1)
    first_on_mic: Literal[1, 2] = Field(..., alias="firstOnMic")


class JudgeScore(BaseModel):
    wrestler_name: str
    score: float = Field(..., ge=0, le=10)


class JudgeResponse(BaseModel):
    winner_name: str
    winner_index: Literal[1, 2]
    summary_line: str
    reason: str
    scores: list[JudgeScore] = Field(..., min_length=2, max_length=2)
