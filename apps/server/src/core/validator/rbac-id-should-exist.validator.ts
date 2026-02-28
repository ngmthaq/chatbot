import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { PrismaService } from '../database/prisma.service';
import { ExceptionDict } from '../exception/exception-dict';

@Injectable()
@ValidatorConstraint({ async: true })
export class RbacIdShouldExist implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(id: string, _args: ValidationArguments) {
    try {
      await this.prismaService.rbac.findFirstOrThrow({
        where: { id: +id },
      });
      return true;
    } catch {
      return false;
    }
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.rbacIdShouldExist();
  }
}
