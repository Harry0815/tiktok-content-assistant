
import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';
import { Pool } from "pg";
import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { RequestIdMiddleware } from './common/request-id.middleware';
import { AuthService } from './auth/auth.service';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const svc = app.get(AuthService, { strict: false });
  console.log("AuthService from container:", svc);

   // RequestId header + basic CORS
   app.use(new RequestIdMiddleware().use);
   app.enableCors({ origin: true, credentials: true });

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

async function seed() {
  const email = "hs@hs.de";
  const plainPassword = "123456";
  const role = "user";

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Create a .env file from .env.example.");
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Check if user exists
    const existing = await pool.query(`SELECT id, email FROM users WHERE email = $1 LIMIT 1`, [email]);
    if (existing.rowCount && existing.rows[0]) {
      console.log(`✅ User already exists: ${existing.rows[0].email} (id: ${existing.rows[0].id})`);
      return;
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const id = nanoid();

    await pool.query(
      `INSERT INTO users (id, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [id, email, passwordHash, role],
    );

    console.log(`✅ Seeded user: ${email}`);
  } finally {
    await pool.end();
  }
}
seed();
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
