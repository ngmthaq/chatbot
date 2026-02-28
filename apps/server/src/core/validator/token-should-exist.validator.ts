import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import dayjs from 'dayjs';

import { PrismaService } from '../database/prisma.service';
import { ExceptionDict } from '../exception/exception-dict';

@Injectable()
@ValidatorConstraint({ async: true })
export class TokenShouldExist implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(token: string, _args: ValidationArguments) {
    try {
      const tokenRecord = await this.prismaService.token.findFirstOrThrow({
        where: { token },
      });
      return dayjs(tokenRecord.expiredAt).isAfter(dayjs());
    } catch {
      return false;
    }
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.tokenShouldExist();
  }
}
