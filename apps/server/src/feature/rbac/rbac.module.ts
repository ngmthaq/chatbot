import { Module } from '@nestjs/common';

import { CoreThrottlerModule } from '../../core/throttler/throttler.module';

import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';

@Module({
  imports: [CoreThrottlerModule],
  controllers: [RbacController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
