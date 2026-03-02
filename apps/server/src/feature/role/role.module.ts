import { Module } from '@nestjs/common';

import { CoreThrottlerModule } from '../../core/throttler/throttler.module';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [CoreThrottlerModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
