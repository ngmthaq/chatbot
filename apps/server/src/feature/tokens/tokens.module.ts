import { Module } from '@nestjs/common';

import { TokenJobsService } from './token-jobs.service';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  controllers: [TokensController],
  providers: [TokensService, TokenJobsService],
  exports: [TokensService, TokenJobsService],
})
export class TokensModule {}
