import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { ResponseBuilder } from '../../core/response/response-builder';
import { AuthGuard } from '../auth/auth.guard';
import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';
import { RbacGuard } from '../rbac/rbac.guard';

import { AdminRoleGuard } from './admin-role.guard';
import { AdminService } from './admin.service';
import { TokenUsageDto } from './token-usage.dto';

@Controller('admin')
@UseGuards(ThrottlerGuard, AuthGuard, RbacGuard, AdminRoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get all users
   */
  @Get('users')
  @Rbac(Module.ADMIN, Action.READ)
  async getAllUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.adminService.getAllUsers(page, limit);

    return ResponseBuilder.pagination(result.data, result.pagination);
  }

  /**
   * Toggle user status
   */
  @Patch('users/:userId/status')
  @Rbac(Module.ADMIN, Action.UPDATE)
  async toggleUserStatus(
    @Param('userId') userId: string,
    @Body() body: { enabled: boolean },
  ) {
    const user = await this.adminService.toggleUserStatus(
      Number(userId),
      body.enabled,
    );

    return ResponseBuilder.data(user);
  }

  /**
   * Get token usage statistics
   */
  @Get('analytics/token-usage')
  @Rbac(Module.ADMIN, Action.READ)
  async getTokenUsage(@Query() dto: TokenUsageDto) {
    const stats = await this.adminService.getTokenUsageStats(
      dto.period || '7d',
    );

    return ResponseBuilder.data(stats);
  }

  /**
   * Get all documents
   */
  @Get('documents')
  @Rbac(Module.ADMIN, Action.READ)
  async getAllDocuments(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
  ) {
    const result = await this.adminService.getAllDocuments(page, limit, status);

    return ResponseBuilder.pagination(result.data, result.pagination);
  }

  /**
   * Delete document as admin
   */
  @Post('documents/:documentId/delete')
  @Rbac(Module.ADMIN, Action.DELETE)
  async deleteDocument(@Param('documentId') documentId: string) {
    await this.adminService.deleteDocumentAdmin(Number(documentId));

    return ResponseBuilder.success(true);
  }
}
