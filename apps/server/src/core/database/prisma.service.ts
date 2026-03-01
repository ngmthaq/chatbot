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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$on('query' as never, (event: any) => {
      this.logger.log(
        `Query: ${event.query} | Params: ${event.params} | Duration: ${event.duration}ms`,
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$on('error' as never, (event: any) => {
      this.logger.error(`Error: ${event.message}`);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$on('info' as never, (event: any) => {
      this.logger.log(`Info: ${event.message}`);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$on('warn' as never, (event: any) => {
      this.logger.warn(`Warn: ${event.message}`);
    });
  }
}
