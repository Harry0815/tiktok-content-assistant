import { Body, Controller, Post} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AuthService } from "./auth.service";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log("AuthService injected?", !!authService, authService);
  }

  @Post('login')
  async login(@Body() dto: any) {
    return this.authService.login(dto.email, dto.password);
  }

  /*
  @Post("login")
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: z.infer<typeof LoginSchema>) {
    console.log("AuthController.login", body.email);
    return this.auth.login(body.email, body.password);
  }

   */
}
