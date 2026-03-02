import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { AudioGateway } from './audio.gateway';
import { AudioService } from './audio.service';
import { SpeechToTextService } from './speech-to-text.service';
import { TextToSpeechService } from './text-to-speech.service';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [
    AudioGateway,
    AudioService,
    SpeechToTextService,
    TextToSpeechService,
  ],
  exports: [AudioService, SpeechToTextService, TextToSpeechService],
})
export class AudioModule {}
