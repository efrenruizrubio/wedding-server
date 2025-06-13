import { NestFactory } from '@nestjs/core';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    exposedHeaders: ['Content-Disposition'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    origin: configService.get('CORS_ORIGIN'),
  });

  if (configService.get('DOCUMENTATION_ENABLED')) {
    const config = new DocumentBuilder()
      .setTitle('Auth Base')
      .setDescription('API description for Auth Base')
      .addBearerAuth()
      .setVersion('0.1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(configService.get('APP_PORT') ?? 5001);
}
bootstrap();
