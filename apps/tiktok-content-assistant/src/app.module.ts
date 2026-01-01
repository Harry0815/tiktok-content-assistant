import { Module } from "@nestjs/common";
import { DbModule } from "./db/db.module";
import { AuthModule } from "./auth/auth.module";
import { BrandsModule } from "./brands/brands.module";
import { DraftsModule } from "./drafts/drafts.module";
import { OpenAiModule } from "./openai/openai.module";

@Module({
  imports: [
    DbModule,
    AuthModule,
    BrandsModule,
    DraftsModule,
    OpenAiModule
  ],
})
export class AppModule {}
