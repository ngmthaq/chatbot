import { Injectable, Logger } from '@nestjs/common';

import { DocumentStatus } from '../../../prisma-generated/enums';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get all users
   */
  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          gender: true,
          dateOfBirth: true,
          roleId: true,
          activatedAt: true,
          lockedAt: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
      }),
      this.prismaService.user.count(),
    ]);

    return {
      data: users,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  /**
   * Toggle user status
   */
  async toggleUserStatus(userId: number, enabled: boolean) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        lockedAt: enabled ? null : new Date(),
      },
    });
  }

  /**
   * Get token usage statistics
   */
  async getTokenUsageStats(period: string) {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    const messages = await this.prismaService.message.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: { tokenUsage: true, conversationId: true },
    });

    const totalTokens = messages.reduce(
      (sum, msg) => sum + (msg.tokenUsage || 0),
      0,
    );

    return {
      period,
      totalMessages: messages.length,
      totalTokens,
      avgTokensPerMessage:
        messages.length > 0 ? Math.round(totalTokens / messages.length) : 0,
    };
  }

  /**
   * Get all documents
   */
  async getAllDocuments(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;

    const whereClause = status
      ? { status: status as DocumentStatus }
      : undefined;

    const [documents, total] = await Promise.all([
      this.prismaService.document.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
        include: { user: { select: { email: true } } },
      }),
      this.prismaService.document.count({ where: whereClause }),
    ]);

    return {
      data: documents,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  /**
   * Delete document as admin
   */
  async deleteDocumentAdmin(documentId: number) {
    await this.prismaService.document.delete({
      where: { id: documentId },
    });
  }
}
