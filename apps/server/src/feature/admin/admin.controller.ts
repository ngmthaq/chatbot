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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(ThrottlerGuard, AuthGuard, RbacGuard, AdminRoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get all users
   */
  @Get('users')
  @Rbac(Module.ADMIN, Action.READ)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get paginated list of all users (admin only)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getAllUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.adminService.getAllUsers(
      Number(page),
      Number(limit),
    );

    return ResponseBuilder.pagination(result.data, result.pagination);
  }

  /**
   * Toggle user status
   */
  @Patch('users/:userId/status')
  @Rbac(Module.ADMIN, Action.UPDATE)
  @ApiOperation({
    summary: 'Toggle user status',
    description: 'Enable or disable user account',
  })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({
    summary: 'Get token usage',
    description: 'Get token usage analytics and statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Token usage stats retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Admin access required' })
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
  @ApiOperation({
    summary: 'Get all documents',
    description: 'Get all documents from all users (admin only)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getAllDocuments(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
  ) {
    const result = await this.adminService.getAllDocuments(
      Number(page),
      Number(limit),
      status,
    );

    return ResponseBuilder.pagination(result.data, result.pagination);
  }

  /**
   * Delete document as admin
   */
  @Post('documents/:documentId/delete')
  @Rbac(Module.ADMIN, Action.DELETE)
  @ApiOperation({
    summary: 'Delete document',
    description: 'Delete any document (admin only)',
  })
  @ApiParam({ name: 'documentId', description: 'Document ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(@Param('documentId') documentId: string) {
    await this.adminService.deleteDocumentAdmin(Number(documentId));

    return ResponseBuilder.success(true);
  }
}
