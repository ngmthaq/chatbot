import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../../../prisma-generated/client';
import { ConfigType } from '../config/config-type';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  public constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.get<ConfigType['databaseHost']>('databaseHost'),
      port: configService.get<ConfigType['databasePort']>('databasePort'),
      user: configService.get<ConfigType['databaseUser']>('databaseUser'),
      password:
        configService.get<ConfigType['databasePassword']>('databasePassword'),
      database: configService.get<ConfigType['databaseName']>('databaseName'),
      allowPublicKeyRetrieval: true,
    });
    super({
      adapter: adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  public async onModuleInit() {
    await this.$connect();
    this.$on('query', (event) => {
      this.logger.log(
        `Query: ${event.query} | Params: ${event.params} | Duration: ${event.duration}ms`,
      );
    });
    this.$on('error', (event) => {
      this.logger.error(`Error: ${event.message}`);
    });
    this.$on('info', (event) => {
      this.logger.log(`Info: ${event.message}`);
    });
    this.$on('warn', (event) => {
      this.logger.warn(`Warn: ${event.message}`);
    });
  }
}
