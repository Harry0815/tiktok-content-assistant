import { Module } from "@nestjs/common";
import { DbModule } from "./db/db.module";
import { BrandsModule } from "./brands/brands.module";
import { DraftsModule } from "./drafts/drafts.module";
import { OpenAiModule } from "./openai/openai.module";
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [DbModule, BrandsModule, DraftsModule, OpenAiModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AppModule {}
