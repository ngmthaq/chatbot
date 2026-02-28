import { Controller } from '@nestjs/common';

import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  public constructor(private readonly tokensService: TokensService) {}
}
