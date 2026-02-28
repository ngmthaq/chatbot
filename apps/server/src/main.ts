/* eslint-disable no-console */

import path from 'path';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { ConfigType } from './core/config/config-type';
import { exceptionFactory } from './core/exception/exception-factory';
import { HttpExceptionFilter } from './core/exception/exception-filter';
import { winstonLogger } from './core/logger/winston';
import dayjs from './utils/date';

/**
 * Configure the NestJS application
 */
async function config(app: NestExpressApplication) {
  app.enableCors();
  app.enableVersioning();
  app.setGlobalPrefix('api');
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
}

/**
 * Implement global interceptors
 * @see: https://docs.nestjs.com/interceptors
 */
async function implementGlobalInterceptors(_app: NestExpressApplication) {}

/**
 * Implement global middlewares
 * @see: https://docs.nestjs.com/middleware
 */
async function implementGlobalMiddlewares(app: NestExpressApplication) {
  app.use(helmet());
  app.use(cookieParser());
  app.use(compression());
}

/**
 * Implement global pipes
 * @see: https://docs.nestjs.com/pipes
 */
async function implementGlobalPipes(app: NestExpressApplication) {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      enableDebugMessages: true,
      exceptionFactory: exceptionFactory,
    }),
  );
}

/**
 * Implement global guards
 * @see: https://docs.nestjs.com/guards
 */
async function implementGlobalGuards(_app: NestExpressApplication) {}

/**
 * Implement global filters
 * @see: https://docs.nestjs.com/exception-filters
 */
async function implementGlobalFilters(app: NestExpressApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}

/**
 * Implement Swagger API documentation
 * @see: https://docs.nestjs.com/openapi/introduction
 */
async function implementSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API Documentation')
    .setDescription('The API documentation for the NestJS application')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, documentFactory, {
    ui: true,
    useGlobalPrefix: true,
    explorer: true,
  });
}

/**
 * Handle application listen event
 * @param port
 * @param startTime
 */
async function handleListenApp(port: number, startTime: number) {
  const duration = dayjs().valueOf() - startTime;
  const nodeVersion = process.version;
  console.log('\n');
  console.log(`Node ${nodeVersion} ready in ${duration}ms`);
  console.log(`-> Local:          http://localhost:${port}/api/`);
  console.log(`-> Swagger UI:     http://localhost:${port}/api/swagger/`);
  console.log(`-> Swagger JSON:   http://localhost:${port}/api/swagger-json/`);
  console.log(`-> Swagger YAML:   http://localhost:${port}/api/swagger-yaml/`);
  console.log('\n');
}

/**
 * Start the NestJS application
 * @param app
 */
async function start(app: NestExpressApplication) {
  const configService = app.get(ConfigService);
  const port = configService.get<ConfigType['port']>('port');
  const startTime = dayjs().valueOf();
  await app.listen(port, () => handleListenApp(port, startTime));
}

/**
 * Bootstrap the NestJS application
 */
async function bootstrap() {
  const logger = WinstonModule.createLogger({ instance: winstonLogger });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: logger,
  });

  await config(app);
  await implementGlobalInterceptors(app);
  await implementGlobalMiddlewares(app);
  await implementGlobalPipes(app);
  await implementGlobalGuards(app);
  await implementGlobalFilters(app);
  await implementSwagger(app);
  await start(app);
}

bootstrap();
