import { Body, Controller, Get, Post, UseGuards, UsePipes } from "@nestjs/common";
import { JwtAuthGuard } from "../common/auth.guard";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { BrandsService } from "./brands.service";
import { CreateBrandSchema, type CreateBrandDto } from "./brands.dto";

@Controller("brands")
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private brands: BrandsService) {}

  @Get()
  list() {
    return this.brands.list();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateBrandSchema))
  create(@Body() dto: CreateBrandDto) {
    return this.brands.create(dto);
  }
}
