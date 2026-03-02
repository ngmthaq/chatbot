import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

/**
 * Core Throttler Module
 * @see: https://docs.nestjs.com/security/rate-limiting
 */
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [ThrottlerGuard],
  exports: [ThrottlerModule, ThrottlerGuard],
})
export class CoreThrottlerModule {}
