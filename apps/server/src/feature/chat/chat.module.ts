import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RagModule } from '../rag/rag.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [AuthModule, RagModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
