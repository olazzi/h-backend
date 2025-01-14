import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingMiddleware } from './logging/logging.middleware';  // Import the logging middleware

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('API to manage users')
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors(); 
  // Start the application
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
