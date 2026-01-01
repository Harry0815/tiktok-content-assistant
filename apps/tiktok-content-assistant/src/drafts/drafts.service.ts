import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DB } from "../db/db.module";
import { brands, drafts, generations, draftVersions } from "@tca-shared";
import { nanoid } from "nanoid";
import { eq, desc, max } from "drizzle-orm";
import { OpenAiService } from "../openai/openai.service";
import { SYSTEM_JSON_RULES, ideasPrompt, fullDraftPrompt, refinePrompt } from "../openai/prompts";
import { IdeasListSchema, FullDraftSchema } from "@tca-shared";
import crypto from "crypto";

@Injectable()
export class DraftsService {
  constructor(@Inject(DB) private db: any, private openai: OpenAiService) {}

  async createDraft(dto: any) {
    const id = nanoid();
    await this.db.insert(drafts).values({
      id,
      brandId: dto.brandId,
      brief: dto.brief,
      style: dto.style,
      lengthSec: dto.lengthSec,
      goal: dto.goal,
      platform: "tiktok",
      status: "new",
    });
    return this.getDraft(id);
  }

  async getDraft(draftId: string) {
    const rows = await this.db.select().from(drafts).where(eq(drafts.id, draftId));
    const draft = rows[0];
    if (!draft) throw new NotFoundException("Draft not found");
    return draft;
  }

  async getVersions(draftId: string) {
    return this.db
      .select()
      .from(draftVersions)
      .where(eq(draftVersions.draftId, draftId))
      .orderBy(desc(draftVersions.version));
  }

  async generateIdeas(draftId: string) {
    const ctx = await this.buildContext(draftId);

    const output = await this.openai.generateStrictJson({
      system: SYSTEM_JSON_RULES,
      user: ideasPrompt(ctx),
      schema: IdeasListSchema,
    });

    await this.persistGeneration(draftId, "ideas_v1", "1.0.0", ctx, output);

    // optional: store as version too
    await this.createDraftVersion(draftId, { ideas: output }, "ideas generated");

    return output;
  }

  async generateDraft(draftId: string, body: { idea_id: string; idea?: any }) {
    const ctx = await this.buildContext(draftId);

    const idea = body.idea ?? { idea_id: body.idea_id };
    const output = await this.openai.generateStrictJson({
      system: SYSTEM_JSON_RULES,
      user: fullDraftPrompt({ ...ctx, idea }),
      schema: FullDraftSchema,
    });

    await this.persistGeneration(draftId, "draft_v1", "1.0.0", { ...ctx, idea }, output);
    await this.createDraftVersion(draftId, output, "draft generated");

    return output;
  }

  async refine(draftId: string, body: { instruction: string; currentDraft: any }) {
    const ctx = await this.buildContext(draftId);

    const output = await this.openai.generateStrictJson({
      system: SYSTEM_JSON_RULES,
      user: refinePrompt({
        ...ctx,
        instruction: body.instruction,
        currentDraftJson: JSON.stringify(body.currentDraft),
      }),
      schema: FullDraftSchema,
    });

    await this.persistGeneration(draftId, "refine_v1", "1.0.0", { ...ctx, instruction: body.instruction }, output);
    await this.createDraftVersion(draftId, output, body.instruction);

    return output;
  }

  private async buildContext(draftId: string) {
    const [draft] = await this.db.select().from(drafts).where(eq(drafts.id, draftId));
    if (!draft) throw new NotFoundException("Draft not found");

    const [brand] = await this.db.select().from(brands).where(eq(brands.id, draft.brandId));
    if (!brand) throw new NotFoundException("Brand not found");

    return {
      brandName: brand.name,
      language: brand.language,
      tonality: brand.tonality,
      dos: brand.dos,
      donts: brand.donts,
      usp: brand.usp,
      ctaDefault: brand.ctaDefault,
      brief: draft.brief,
      style: draft.style,
      lengthSec: draft.lengthSec,
      goal: draft.goal,
    };
  }

  private async persistGeneration(draftId: string, promptName: string, promptVersion: string, input: any, output: any) {
    const id = nanoid();
    const inputHash = crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
    await this.db.insert(generations).values({
      id,
      draftId,
      promptName,
      promptVersion,
      inputHash,
      outputJson: JSON.stringify(output),
    });
  }

  private async createDraftVersion(draftId: string, content: any, notes: string) {
    const [{ v }] = await this.db
      .select({ v: max(draftVersions.version) })
      .from(draftVersions)
      .where(eq(draftVersions.draftId, draftId));

    const nextVersion = (v ?? 0) + 1;

    await this.db.insert(draftVersions).values({
      id: nanoid(),
      draftId,
      version: nextVersion,
      contentJson: JSON.stringify(content),
      notes: notes ?? "",
    });

    return nextVersion;
  }
}
