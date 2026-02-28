import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigType } from '../config/config-type';
import { CoreConfigModule } from '../config/config.module';

/**
 * Core queue module that sets up queuing for the application.
 * @see: https://docs.nestjs.com/techniques/queues
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [CoreConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<ConfigType['messageQueueRedisHost']>(
            'messageQueueRedisHost',
          ),
          port: configService.get<ConfigType['messageQueueRedisPort']>(
            'messageQueueRedisPort',
          ),
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class CoreQueueModule {}
