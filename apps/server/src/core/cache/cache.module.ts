import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';

import { ConfigType } from '../config/config-type';
import { CoreConfigModule } from '../config/config.module';

/**
 * Core cache module that sets up caching for the application.
 * @see: https://docs.nestjs.com/techniques/caching
 */
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [CoreConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host =
          configService.get<ConfigType['cacheRedisHost']>('cacheRedisHost');
        const port =
          configService.get<ConfigType['cacheRedisPort']>('cacheRedisPort');
        const ttl = configService.get<ConfigType['cacheTtl']>('cacheTtl');
        const lruSize =
          configService.get<ConfigType['cacheLruSize']>('cacheLruSize');

        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl, lruSize }),
            }),
            new KeyvRedis(`redis://${host}:${port}`),
          ],
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CoreCacheModule {}
