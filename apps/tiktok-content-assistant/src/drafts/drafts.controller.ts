import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import { JwtAuthGuard } from "../common/auth.guard";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { DraftsService } from "./drafts.service";
import { CreateDraftSchema, GenerateDraftSchema, RefineSchema } from "./drafts.dto";

@Controller("drafts")
@UseGuards(JwtAuthGuard)
export class DraftsController {
  constructor(private drafts: DraftsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateDraftSchema))
  create(@Body() body: any) {
    return this.drafts.createDraft(body);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.drafts.getDraft(id);
  }

  @Get(":id/versions")
  versions(@Param("id") id: string) {
    return this.drafts.getVersions(id);
  }

  @Post(":id/generate-ideas")
  generateIdeas(@Param("id") id: string) {
    return this.drafts.generateIdeas(id);
  }

  @Post(":id/generate-draft")
  @UsePipes(new ZodValidationPipe(GenerateDraftSchema))
  generateDraft(@Param("id") id: string, @Body() body: any) {
    return this.drafts.generateDraft(id, body);
  }

  @Post(":id/refine")
  @UsePipes(new ZodValidationPipe(RefineSchema))
  refine(@Param("id") id: string, @Body() body: any) {
    return this.drafts.refine(id, body);
  }
}
