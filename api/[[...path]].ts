import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AppModule } from '../apps/api/src/app.module';

const server = express();

// Cached across invocations that reuse a warm lambda, so Nest and the Prisma
// connection pool are built once rather than per request.
let bootstrapped: Promise<void> | null = null;

async function bootstrap() {
  const adapter = new ExpressAdapter(server);
  const app = await NestFactory.create(AppModule, adapter, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') ?? true,
      credentials: true,
    },
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  await app.init();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!bootstrapped) {
      bootstrapped = bootstrap();
    }
    await bootstrapped;
  } catch (err) {
    // Reset so the next request retries instead of reusing a broken lambda.
    bootstrapped = null;
    console.error('Nest bootstrap failed', err);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  server(req, res);
}
