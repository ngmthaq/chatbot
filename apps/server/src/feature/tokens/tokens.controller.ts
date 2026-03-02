import { Controller, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { TokensService } from './tokens.service';

@Controller('tokens')
@UseGuards(ThrottlerGuard)
export class TokensController {
  public constructor(private readonly tokensService: TokensService) {}
}
