import * as fs from 'fs/promises';
import * as path from 'path';

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { ConfigType } from '../../core/config/config-type';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';

@Injectable()
export class SpeechToTextService {
  private readonly logger = new Logger(SpeechToTextService.name);
  private readonly ollamaBaseUrl?: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const ollamaUrl =
      this.configService.get<ConfigType['ollamaUrl']>('ollamaUrl');
    this.ollamaBaseUrl =
      typeof ollamaUrl === 'function' ? ollamaUrl() : ollamaUrl;
  }

  /**
   * Transcribe audio buffer to text using Whisper model via Ollama
   * Note: This requires Whisper model to be available in Ollama
   */
  async transcribe(
    audioBuffer: Buffer,
    format: string = 'wav',
  ): Promise<string> {
    this.logger.debug(`Transcribing audio (format: ${format})`);

    try {
      // Save audio buffer to temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });

      const tempFile = path.join(tempDir, `audio-${Date.now()}.${format}`);
      await fs.writeFile(tempFile, audioBuffer);

      try {
        // Use Ollama's API for transcription (if Whisper is available)
        // Note: This is a placeholder. Actual implementation depends on Ollama's capabilities
        // For production, you may want to use OpenAI's Whisper API or a local Whisper instance

        const transcription = await this.transcribeWithWhisper(audioBuffer);

        return transcription;
      } finally {
        // Cleanup temp file
        try {
          await fs.unlink(tempFile);
        } catch (error) {
          this.logger.warn(
            `Failed to cleanup temp file: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.serviceUnavailable({
        errors: [ExceptionDict.speechToTextFailed()],
      });
    }
  }

  /**
   * Placeholder for Whisper-based transcription
   * In production, integrate with actual Whisper API or local instance
   */
  private async transcribeWithWhisper(_audioBuffer: Buffer): Promise<string> {
    // TODO: Implement actual Whisper integration
    // Options:
    // 1. Use OpenAI's Whisper API
    // 2. Use local Whisper model via Python subprocess
    // 3. Use Ollama if it supports audio models in the future

    this.logger.warn(
      'Using placeholder transcription - Whisper integration not yet implemented',
    );

    // For now, return a placeholder
    // In production, replace with actual Whisper API call
    return 'Audio transcription not yet implemented. Please integrate Whisper API.';
  }

  /**
   * Alternative: Simple transcription using external API (placeholder)
   */
  async transcribeWithExternalAPI(
    audioBuffer: Buffer,
    apiUrl: string,
  ): Promise<string> {
    try {
      const formData = new FormData();
      // Convert Buffer to ArrayBuffer for Blob
      const arrayBuffer = audioBuffer.buffer.slice(
        audioBuffer.byteOffset,
        audioBuffer.byteOffset + audioBuffer.byteLength,
      ) as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      formData.append('audio', blob, 'audio.wav');

      const response = await firstValueFrom(
        this.httpService.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
      );

      return response.data.text || '';
    } catch (error) {
      this.logger.error(
        `External API transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Detect language from audio (placeholder)
   */
  async detectLanguage(_audioBuffer: Buffer): Promise<string> {
    // TODO: Implement language detection
    return 'en';
  }

  /**
   * Validate audio format and quality
   */
  validateAudioFormat(format: string): boolean {
    const supportedFormats = ['wav', 'mp3', 'ogg', 'webm', 'flac'];
    return supportedFormats.includes(format.toLowerCase());
  }
}
