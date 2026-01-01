export const SYSTEM_JSON_RULES = `
You are a content generation engine for TikTok marketing.
Return ONLY valid JSON.
No markdown. No commentary. No code fences.
Follow Brand Voice and constraints strictly.
If unsure, add notes to compliance_notes instead of inventing facts.
`;

export function ideasPrompt(ctx: any) {
  return `
Generate TikTok video ideas.

CONTEXT
Brand: ${ctx.brandName}
Language: ${ctx.language}
Tonality: ${ctx.tonality}
Do: ${ctx.dos}
Don't: ${ctx.donts}
USP: ${ctx.usp}
Default CTA: ${ctx.ctaDefault}

Brief: ${ctx.brief}
Style: ${ctx.style}
Target length: ${ctx.lengthSec} seconds
Goal: ${ctx.goal}

OUTPUT JSON schema:
{
  "ideas": [
    {
      "idea_id": "string",
      "title": "string",
      "angle": "string",
      "format": "string",
      "target_length_seconds": number,
      "difficulty": "low|medium|high",
      "hook_options": ["string","string","string"],
      "cta": "string"
    }
  ]
}

Rules:
- Provide 10 ideas.
- Provide >= 3 hook_options per idea.
- Hooks are short (0-2s) and TikTok-native.
`;
}

export function fullDraftPrompt(ctx: any) {
  return `
Create a complete TikTok script + shotlist for the selected idea.

CONTEXT
Brand: ${ctx.brandName}
Language: ${ctx.language}
Tonality: ${ctx.tonality}
Do: ${ctx.dos}
Don't: ${ctx.donts}
USP: ${ctx.usp}
Default CTA: ${ctx.ctaDefault}

Brief: ${ctx.brief}
Style: ${ctx.style}
Target length: ${ctx.lengthSec} seconds
Goal: ${ctx.goal}

SELECTED IDEA
${JSON.stringify(ctx.idea)}

Rules:
- Strong hook (0-2s), short sentences.
- Include pattern interrupts.
- Return only JSON matching the expected schema.
`;
}

export function refinePrompt(ctx: any) {
  return `
Refine the existing TikTok draft according to the instruction.

Brand voice:
Language: ${ctx.language}
Tonality: ${ctx.tonality}
Do: ${ctx.dos}
Don't: ${ctx.donts}

Instruction:
${ctx.instruction}

Current draft JSON:
${ctx.currentDraftJson}

OUTPUT:
Return ONLY the updated draft JSON matching the same schema.
`;
}
