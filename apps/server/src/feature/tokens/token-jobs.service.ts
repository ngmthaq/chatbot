import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../../core/database/prisma.service';
import dayjs from '../../utils/date';

@Injectable()
export class TokenJobsService {
  private readonly logger = new Logger(TokenJobsService.name);

  public constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR, { name: 'cleanUpExpiredTokens' })
  public async cleanUpExpiredTokens() {
    const result = await this.prismaService.token.deleteMany({
      where: {
        expiredAt: {
          lt: dayjs().toDate(),
        },
      },
    });

    this.logger.log(`Cleaned up ${result.count} expired tokens.`);
  }
}
