import { Module } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';

import { AudioService } from './audio.service';

@WebSocketGateway()
export class AudioGateway {}

@Module({
  providers: [AudioGateway, AudioService],
  exports: [AudioService],
})
export class AudioModule {}
