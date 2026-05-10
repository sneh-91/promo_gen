from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

Alignment = Literal["babyface", "tweener", "heel"]
Size = Literal["small", "average", "big", "giant"]

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
    look: LookStr
    description: DescriptionStr


class PromoRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    players: list[Player] = Field(..., min_length=2, max_length=2)
    first_on_mic: Literal[1, 2] = Field(..., alias="firstOnMic")


class PromoTurn(BaseModel):
    wrestler: str
    response: str


class PromoResponse(BaseModel):
    transcript: list[PromoTurn]
    portrait_1: str | None = None
    portrait_2: str | None = None
