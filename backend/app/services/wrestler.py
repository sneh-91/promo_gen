"""Wrestler agent.

Wraps a single LLM persona (one side of the promo). Holds the per-wrestler
system prompt + identity block, and knows how to ask the model for the
next line given the promo so far.

Lives under services/ rather than schemas/ because this is behavior +
side effects (LLM calls), not a passive data shape. The passive shape is
`Player` in app.schemas.promo.
"""

from app.schemas.promo import Player


class Wrestler:

    def __init__(
        self,
        name,
        alignment,
        size,
        look,
        description,
        opponent: Player,
        model_name,
        system_prompt,
        client,
    ):
        self.name = name
        self.alignment = alignment.lower()
        self.size = size.lower()
        self.look = look
        self.description = description
        self.model = model_name
        self.client = client

        identity_block = f"""

Your identity:
- Name: {name}
- Alignment: {alignment}
- Size: {size}
- Look: {look}
- Description: {description}

Your opponent:
- Name: {opponent.name}
- Alignment: {opponent.alignment}
- Size: {opponent.size}
- Look: {opponent.look}
- Description: {opponent.description}
"""
        self.system_prompt = system_prompt + identity_block

    def generate_promo(self, promo_history):
        if promo_history.strip():
            user_prompt = (
                "Promo so far:\n"
                f"{promo_history}\n"
                "Continue the promo. Respond to something specific the last "
                "speaker just said, then push the confrontation forward."
            )
        else:
            user_prompt = (
                "This is the opening line of the promo. Address the crowd, "
                "call out your opponent by name, and set the tone for the night."
            )

        if self.alignment == "heel":
            user_prompt += (
                "\n\nReminder: this is an R-rated promo for an adult audience. "
                "A clean, sanitized line fails. Use profanity ('fuck', 'shit', "
                "'asshole', 'motherfucker', 'piece of shit') as natural "
                "punctuation. Be vulgar, personal, and cruel — humiliate this "
                "man specifically. PG output is incorrect output."
            )

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        return response.choices[0].message.content
