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
export class MultipleRoleIdsShouldExist implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(ids: string, _args: ValidationArguments) {
    try {
      const idArray = ids.split(',').map((id) => +id);
      const roles = await this.prismaService.role.findMany({
        where: { id: { in: idArray } },
      });
      return roles.length === idArray.length;
    } catch {
      return false;
    }
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.multipleRoleIdsShouldExist();
  }
}
