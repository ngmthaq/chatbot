import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { TokensService } from './tokens.service';

@ApiTags('Tokens')
@ApiBearerAuth()
@Controller('tokens')
@UseGuards(ThrottlerGuard)
export class TokensController {
  public constructor(private readonly tokensService: TokensService) {}
}
