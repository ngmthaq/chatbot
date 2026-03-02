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
   */
  async generateText(req: GenerateRequest): Promise<string> {
    const requestBody = {
      model: req.model || 'gemma3',
      prompt: req.prompt,
      stream: false,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<GenerateResponse>(
          `${this.baseUrl}/api/generate`,
          requestBody,
        ),
      );

      return response.data.response || '';
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      this.logger.error(
        `Failed to generate text at ${this.baseUrl}/api/generate: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      this.logger.error(
        `Status: ${axiosError.response?.status}, Data: ${JSON.stringify(axiosError.response?.data)}`,
      );
      this.logger.error(
        `Request URL: ${axiosError.config?.url}, Method: ${axiosError.config?.method}`,
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
    const request = {
      model:
        this.configService.get<ConfigType['ollamaEmbedModel']>(
          'ollamaEmbedModel',
        ),
      input: text,
    };

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await firstValueFrom(
          this.httpService.post<EmbeddingResponse>(
            `${this.baseUrl}/api/embed`,
            request,
          ),
        );

        return response.data.embeddings[0] || [];
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosError = error as any;
        this.logger.error(
          `Embedding attempt ${attempt + 1} failed at ${this.baseUrl}/api/embed: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
        );
        this.logger.error(
          `Status: ${axiosError.response?.status}, Data: ${JSON.stringify(axiosError.response?.data)}`,
        );
        this.logger.error(
          `Request URL: ${axiosError.config?.url}, Method: ${axiosError.config?.method}`,
        );
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
    const request = {
      model: 'gemma3',
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

      return response.data.response || '';
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
  async countTokens(text: string, model: string = 'gemma3'): Promise<number> {
    try {
      const request = {
        model,
        prompt: text,
      };

      const response = await firstValueFrom(
        this.httpService.post<GenerateResponse>(
          `${this.baseUrl}/api/generate`,
          request,
        ),
      );

      return response.data.eval_count || 0;
    } catch (error) {
      this.logger.warn(
        `Failed to count tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return Math.ceil(text.length / 4); // Estimate
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
