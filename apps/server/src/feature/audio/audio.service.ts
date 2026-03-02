/**
 * Audio Service - Orchestrates audio processing operations
 *
 * NOTE: This is an OPTIONAL service. Audio processing is primarily CLIENT-SIDE.
 * This service provides fallback capabilities for browsers/apps that need server-side processing.
 *
 * Current implementation uses placeholder STT/TTS services that can be replaced with:
 * - OpenAI Whisper (STT) + OpenAI TTS
 * - Google Cloud Speech-to-Text + Text-to-Speech
 * - AWS Transcribe + Polly
 * - ElevenLabs (TTS)
 * - Local Whisper model
 */
import { Injectable, Logger } from '@nestjs/common';

import { SpeechToTextService } from './speech-to-text.service';
import { TextToSpeechService } from './text-to-speech.service';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);

  constructor(
    private readonly speechToTextService: SpeechToTextService,
    private readonly textToSpeechService: TextToSpeechService,
  ) {}

  /**
   * Process audio chunk and return transcription
   */
  async processAudioChunk(
    audioData: Buffer,
    format: string = 'wav',
  ): Promise<string> {
    this.logger.debug('Processing audio chunk');

    try {
      const transcription = await this.speechToTextService.transcribe(
        audioData,
        format,
      );
      return transcription;
    } catch (error) {
      this.logger.error(
        `Failed to process audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Generate audio response from text
   */
  async generateAudioResponse(text: string, voiceId?: string): Promise<Buffer> {
    this.logger.debug('Generating audio response');

    try {
      const audioBuffer = await this.textToSpeechService.synthesize(
        text,
        voiceId,
      );
      return audioBuffer;
    } catch (error) {
      this.logger.error(
        `Failed to generate audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Get available voices for TTS
   */
  async getAvailableVoices() {
    return this.textToSpeechService.getAvailableVoices();
  }

  /**
   * Validate audio format
   */
  validateAudioFormat(format: string): boolean {
    return this.speechToTextService.validateAudioFormat(format);
  }
}
