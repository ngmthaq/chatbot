import { Injectable, Logger } from '@nestjs/common';

import { OllamaService } from '../ollama/ollama.service';

import { ProcessImageDto } from './process-image.dto';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(private readonly ollamaService: OllamaService) {}

  /**
   * Process image with vision model
   */
  async processImage(dto: ProcessImageDto): Promise<string> {
    try {
      const response = await this.ollamaService.processImage(
        dto.image,
        dto.prompt,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
