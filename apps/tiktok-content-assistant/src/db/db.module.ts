import { Module } from "@nestjs/common";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@tca-shared";

export const DB = Symbol("DB");

@Module({
  providers: [
    {
      provide: Pool,
      useFactory: () => new Pool({ connectionString: process.env.DATABASE_URL }),
    },
    {
      provide: DB,
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
      inject: [Pool],
    },
  ],
  exports: [DB, Pool],
})
export class DbModule {}
