import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { ResponseBuilder } from '../../core/response/response-builder';
import { AuthGuard } from '../auth/auth.guard';
import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';
import { RbacGuard } from '../rbac/rbac.guard';

import { ImagesService } from './images.service';
import { ProcessImageDto } from './process-image.dto';

@ApiTags('Images')
@ApiBearerAuth()
@Controller('images')
@UseGuards(ThrottlerGuard, AuthGuard, RbacGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Process image with vision model
   */
  @Post('analyze')
  @Rbac(Module.USERS, Action.CREATE)
  @ApiOperation({
    summary: 'Analyze image',
    description: 'Analyze image using vision model (LLaVA)',
  })
  @ApiResponse({ status: 200, description: 'Image analyzed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid image format' })
  async analyzeImage(@Body() dto: ProcessImageDto) {
    const result = await this.imagesService.processImage(dto);

    return ResponseBuilder.data({ response: result });
  }
}
