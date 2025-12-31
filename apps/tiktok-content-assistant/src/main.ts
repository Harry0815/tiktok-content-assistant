import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { RequestIdMiddleware } from "./common/request-id.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // RequestId header + basic CORS
  app.use(new RequestIdMiddleware().use);
  app.enableCors({ origin: true, credentials: true });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
