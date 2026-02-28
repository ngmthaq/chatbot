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
export class RoleNameShouldNotExist implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(name: string, _args: ValidationArguments) {
    try {
      const role = await this.prismaService.role.findFirst({
        where: { name },
      });
      return !role;
    } catch {
      return false;
    }
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.roleNameShouldNotExist();
  }
}
