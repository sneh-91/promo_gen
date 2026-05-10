from app.schemas.promo import Voice

VOICE_STYLE_LABELS: dict[Voice, str] = {
    "alloy": "Main Event Power",
    "ash": "Street Fighter Edge",
    "coral": "Showboat Charisma",
    "sage": "Cold Technician",
    "verse": "Arena Narrator",
}

VOICE_STYLE_PROMPTS: dict[Voice, str] = {
    "alloy": (
        "Deliver with main-event power. Sound commanding, dominant, heavyweight, "
        "and forceful. Favor strong, declarative phrasing and the presence of someone "
        "who expects the whole arena to listen."
    ),
    "ash": (
        "Deliver with street-fighter edge. Sound gritty, rough, aggressive, and a little "
        "unpolished in a good way. Favor sharper hits, uglier language, and the energy "
        "of someone who learned to fight before they learned to pose."
    ),
    "coral": (
        "Deliver with showboat charisma. Sound flashy, theatrical, cocky, and magnetic. "
        "Favor crowd-baiting lines, swagger, and language that feels like a star performing "
        "for every camera in the building."
    ),
    "sage": (
        "Deliver with cold technician precision. Sound calm, surgical, composed, and exact. "
        "Favor controlled language, pointed observations, and the feeling that every word is "
        "placed exactly where it can do the most damage."
    ),
    "verse": (
        "Deliver with arena narrator drama. Sound cinematic, polished, dramatic, and larger "
        "than life. Favor vivid phrasing, big-match atmosphere, and lines that feel built "
        "for a sold-out arena."
    ),
}
