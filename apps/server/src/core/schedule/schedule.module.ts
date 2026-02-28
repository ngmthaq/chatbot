import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

/**
 * Core schedule module that sets up scheduling for the application.
 * @see: https://docs.nestjs.com/techniques/task-scheduling
 */
@Module({
  imports: [ScheduleModule.forRoot()],
  exports: [ScheduleModule],
})
export class CoreScheduleModule {}
