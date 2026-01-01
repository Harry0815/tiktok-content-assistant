
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';


const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Socket.io Adapter für Fastify konfigurieren
  // app.useWebSocketAdapter(new IoAdapter(app));
  app.useWebSocketAdapter(new WsAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('chatbot-api')
    .setDescription('The chatbot-api API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Gib deinen API Key ein (z. B. Bearer abc123)',
        in: 'header',
      },
      'api-key'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, host);
  console.log(`🚀 chatbot-api is running at http://${host}:${port}`);
};

bootstrap();




// import "dotenv/config";
// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";
// import { RequestIdMiddleware } from "./common/request-id.middleware";
//
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//
//   // RequestId header + basic CORS
//   app.use(new RequestIdMiddleware().use);
//   app.enableCors({ origin: true, credentials: true });
//
//   const port = Number(process.env.PORT ?? 3000);
//   await app.listen(port);
//
//   console.log(`Backend listening on http://localhost:${port}`);
// }
// bootstrap();
