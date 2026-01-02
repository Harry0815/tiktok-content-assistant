import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { DB } from "../db/db.module";
import { users } from "@tca-shared";

@Injectable()
export class AuthService {
  constructor(@Inject(DB) private db: any, private jwt: JwtService) {}

  async login(email: string, password: string) {
    const rows = await this.db.select().from(users).where(eq(users.email, email));
    const user = rows[0];
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role });
    console.log(token);
    return { access_token: token };
  }
}
