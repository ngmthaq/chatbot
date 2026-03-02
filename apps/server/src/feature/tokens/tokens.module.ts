import { Module } from '@nestjs/common';

import { CoreThrottlerModule } from '../../core/throttler/throttler.module';

import { TokenJobsService } from './token-jobs.service';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  imports: [CoreThrottlerModule],
  controllers: [TokensController],
  providers: [TokensService, TokenJobsService],
  exports: [TokensService, TokenJobsService],
})
export class TokensModule {}
