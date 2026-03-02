import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { ResponseBuilder } from '../../core/response/response-builder';
import { AuthGuard } from '../auth/auth.guard';
import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';
import { RbacGuard } from '../rbac/rbac.guard';

import { ImagesService } from './images.service';
import { ProcessImageDto } from './process-image.dto';

@Controller('images')
@UseGuards(AuthGuard, RbacGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Process image with vision model
   */
  @Post('analyze')
  @Rbac(Module.USERS, Action.CREATE)
  async analyzeImage(@Body() dto: ProcessImageDto) {
    const result = await this.imagesService.processImage(dto);

    return ResponseBuilder.data({ response: result });
  }
}
