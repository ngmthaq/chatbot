import { Module } from '@nestjs/common';

import { CoreThrottlerModule } from '../../core/throttler/throttler.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [CoreThrottlerModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
