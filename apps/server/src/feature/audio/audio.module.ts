/**
 * Audio Module - Optional WebSocket Audio Streaming
 * 
 * NOTE: Audio processing (STT/TTS) is primarily handled CLIENT-SIDE using Chrome Web Speech API.
 * This module provides server-side audio processing capabilities as an OPTIONAL feature for:
 * - Non-Chrome browsers that don't support Web Speech API
 * - Mobile applications requiring server-side processing
 * - Privacy-focused deployments where audio should not use external APIs
 * - Advanced audio processing features (noise reduction, multi-language, etc.)
 * 
 * Current Status: Placeholder implementation with WebSocket infrastructure ready.
 * Services are stubs that can be replaced with actual TTS/STT providers if needed.
 */
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
