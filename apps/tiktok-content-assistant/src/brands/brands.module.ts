import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";
import { BrandsController } from "./brands.controller";
import { BrandsService } from "./brands.service";

@Module({
  imports: [DbModule],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
