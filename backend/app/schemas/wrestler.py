class Wrestler:

    def __init__(self, name, alignment, size, look, description, model_name, system_prompt, client):
        self.name = name
        self.alignment = alignment.lower()
        self.size = size.lower()
        self.look = look
        self.description = description
        self.model = model_name
        self.client = client

        system_prompt_addded_context = f"""
        Your identity:
- Name: {name}
- Alignment: {alignment} 
- Size: {size}
- Look: {look}
- Description: {description}
"""
        self.system_prompt = system_prompt + system_prompt_addded_context

    def generate_promo(self, promo_history):
        
        
        user_prompt = f""" You are a WWE wrestler in a live promo battle.

Style rules:
- Stay fully in character
- Speak like you're addressing a live crowd or other wrestlers
- Keep it INTENSE, emotional, and DIRECT
- Reference something specific the last speaker said IF POSSIBLE
- Do NOT repeat generic lines or give speeches
- Do NOT speak for other wrestlers
- Keep it under 120 words
- RESPONSE FORMAT: Single paragraph, blurb only; use Markdown (e.g. **bold**); no code blocks

Tone guidance:
- Heel → arrogant, mocking, disrespectful, occasional swearing
- Face → confident, resilient, inspirational, fires back without whining
- Tweener → blunt, honest, calls out BOTH sides, sarcastic

Here is the promo so far:
{promo_history}

Now continue the promo. Make your response hit hard and move the confrontation forward.
        """
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        return response.choices[0].message.content