import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AuthService } from "./auth.service";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("login")
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: z.infer<typeof LoginSchema>) {
    return this.auth.login(body.email, body.password);
  }
}
