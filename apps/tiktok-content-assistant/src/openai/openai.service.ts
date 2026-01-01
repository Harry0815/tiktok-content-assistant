import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { z } from "zod";

@Injectable()
export class OpenAiService {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async generateStrictJson<T>(opts: {
    system: string;
    user: string;
    schema: z.ZodSchema<T>;
    model?: string;
  }): Promise<T> {
    const model = opts.model ?? (process.env.OPENAI_MODEL || "gpt-4.1-mini");

    const raw1 = await this.call(model, opts.system, opts.user);
    const parsed1 = this.safeJsonParse(raw1);
    if (parsed1.ok) {
      const v1 = opts.schema.safeParse(parsed1.value);
      if (v1.success) return v1.data;
      // one repair round with validation issues
      const issues = v1.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("\n");
      const repaired = await this.call(model, opts.system,
        `Repair the JSON to satisfy these Zod issues. Return ONLY valid JSON.\nIssues:\n${issues}\n\nJSON:\n${raw1}`
      );
      const parsed2 = this.safeJsonParse(repaired);
      if (!parsed2.ok) throw new Error("Model returned invalid JSON after repair.");
      const v2 = opts.schema.safeParse(parsed2.value);
      if (!v2.success) throw new Error("Model JSON still fails schema after repair.");
      return v2.data;
    }

    // parse failed: ask to fix
    const raw2 = await this.call(model, opts.system, `Fix JSON. Return ONLY valid JSON.\n\n${raw1}`);
    const parsed2 = this.safeJsonParse(raw2);
    if (!parsed2.ok) throw new Error("Model returned invalid JSON after fix.");
    const v2 = opts.schema.safeParse(parsed2.value);
    if (!v2.success) throw new Error("Model JSON fails schema after fix.");
    return v2.data;
  }

  private async call(model: string, system: string, user: string): Promise<string> {
    const resp = await this.client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature: 0.7,
    });
    return resp.choices[0]?.message?.content ?? "";
  }

  private safeJsonParse(text: string): { ok: true; value: unknown } | { ok: false } {
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch {
      return { ok: false };
    }
  }
}
