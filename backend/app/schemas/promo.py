from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Alignment = Literal["babyface", "tweener", "heel"]
Size = Literal["small", "average", "big", "giant"]


class Player(BaseModel):
    name: str = Field(..., max_length=60)
    alignment: Alignment
    size: Size
    look: str = Field(..., max_length=800)
    description: str = Field(..., max_length=2500)


class PromoRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    players: list[Player]
    first_on_mic: Literal[1, 2] = Field(..., alias="firstOnMic")


class PromoTurn(BaseModel):
    wrestler: str
    response: str


class PromoResponse(BaseModel):
    transcript: list[PromoTurn]
    portrait_1: str | None = None
    portrait_2: str | None = None
