import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";
import { OpenAiModule } from "../openai/openai.module";
import { DraftsController } from "./drafts.controller";
import { DraftsService } from "./drafts.service";

@Module({
  imports: [DbModule, OpenAiModule],
  controllers: [DraftsController],
  providers: [DraftsService],
})
export class DraftsModule {}
