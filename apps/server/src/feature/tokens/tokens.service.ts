import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class TokensService {
  public constructor(private readonly prismaService: PrismaService) {}
}
