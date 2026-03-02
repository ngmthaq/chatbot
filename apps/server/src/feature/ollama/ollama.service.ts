import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { ConfigType } from '../../core/config/config-type';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';

import {
  GenerateRequest,
  GenerateResponse,
  EmbeddingResponse,
} from './ollama-response.type';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly baseUrl?: string;
  private readonly retryAttempts = 3;
  private readonly retryDelay = 1000; // ms

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const ollamaUrl =
      this.configService.get<ConfigType['ollamaUrl']>('ollamaUrl');
    this.baseUrl = typeof ollamaUrl === 'function' ? ollamaUrl() : ollamaUrl;
  }

  /**
   * Generate text using Ollama chat model
   * Streams response
   */
  async generateText(req: GenerateRequest): Promise<AsyncIterable<string>> {
    this.logger.debug(`Generating text with model: ${req.model}`);

    const requestBody = {
      model: req.model || 'llama3',
      prompt: req.prompt,
      stream: true,
      temperature: req.temperature ?? 0.7,
      num_predict: req.num_predict ?? 512,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/api/generate`, requestBody, {
          responseType: 'stream',
        }),
      );

      return this.parseStreamResponse(response.data);
    } catch (error) {
      this.logger.error(
        `Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.serviceUnavailable({
        errors: [ExceptionDict.ollamaServiceUnavailable()],
      });
    }
  }

  /**
   * Generate embeddings for text
   * Used for vector storage
   */
  async generateEmbedding(text: string): Promise<number[]> {
    this.logger.debug(`Generating embedding for text length: ${text.length}`);

    const request = {
      prompt: text,
      model:
        this.configService.get<ConfigType['ollamaEmbedModel']>(
          'ollamaEmbedModel',
        ),
    };

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await firstValueFrom(
          this.httpService.post<EmbeddingResponse>(
            `${this.baseUrl}/api/embeddings`,
            request,
          ),
        );

        return response.data.embedding;
      } catch {
        if (attempt < this.retryAttempts - 1) {
          this.logger.warn(
            `Embedding generation attempt ${attempt + 1} failed, retrying...`,
          );
          await this.sleep(this.retryDelay * (attempt + 1));
          continue;
        }

        this.logger.error(
          `Failed to generate embedding after ${this.retryAttempts} attempts`,
        );
        throw ExceptionBuilder.serviceUnavailable({
          errors: [ExceptionDict.embeddingGenerationFailed()],
        });
      }
    }

    throw ExceptionBuilder.serviceUnavailable({
      errors: [ExceptionDict.embeddingGenerationFailed()],
    });
  }

  /**
   * Process image with vision model
   */
  async processImage(imageBase64: string, prompt: string): Promise<string> {
    this.logger.debug('Processing image with llava model');

    const request = {
      model: 'llava',
      prompt: prompt,
      images: [imageBase64],
      stream: false,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<GenerateResponse>(
          `${this.baseUrl}/api/generate`,
          request,
        ),
      );

      return response.data.response;
    } catch (error) {
      this.logger.error(
        `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.serviceUnavailable({
        errors: [ExceptionDict.imageProcessingFailed()],
      });
    }
  }

  /**
   * Get token count for text
   */
  async countTokens(text: string, model: string = 'llama3'): Promise<number> {
    try {
      const request = {
        model,
        prompt: text,
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/api/generate`, request),
      );

      return response.data.eval_count || 0;
    } catch (error) {
      this.logger.warn(
        `Failed to count tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return Math.ceil(text.length / 4); // Estimate
    }
  }

  /**
   * Parse streaming response from Ollama
   */
  private async *parseStreamResponse(
    stream: AsyncIterable<Buffer>,
  ): AsyncIterable<string> {
    let buffer = '';

    for await (const chunk of stream) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');

      // Keep last incomplete line in buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data = JSON.parse(line) as GenerateResponse;
          if (data.response) {
            yield data.response;
          }
        } catch (error) {
          this.logger.warn(
            `Failed to parse stream line: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }
    }

    // Yield remaining buffer
    if (buffer.trim()) {
      try {
        const data = JSON.parse(buffer) as GenerateResponse;
        if (data.response) {
          yield data.response;
        }
      } catch (error) {
        this.logger.warn(
          `Failed to parse final buffer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
