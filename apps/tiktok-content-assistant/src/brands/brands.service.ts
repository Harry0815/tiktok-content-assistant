import { Inject, Injectable } from "@nestjs/common";
import { DB } from "../db/db.module";
import { brands } from "@tca-shared";
import { nanoid } from "nanoid";
import type { CreateBrandDto } from "./brands.dto";

@Injectable()
export class BrandsService {
  constructor(@Inject(DB) private db: any) {}

  async list() {
    return this.db.select().from(brands);
  }

  async create(dto: CreateBrandDto) {
    const id = nanoid();
    await this.db.insert(brands).values({
      id,
      name: dto.name,
      language: dto.language ?? "de",
      tonality: dto.tonality,
      dos: dto.dos ?? "",
      donts: dto.donts ?? "",
      usp: dto.usp ?? "",
      ctaDefault: dto.ctaDefault ?? "",
      examples: dto.examples ?? "",
    });
    const [row] = await this.db.select().from(brands).where((b: any) => b.id.eq?.(id) ?? undefined);
    return row ?? { id };
  }
}
