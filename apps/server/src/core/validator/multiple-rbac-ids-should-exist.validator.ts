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
export class MultipleRbacIdsShouldExist implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(ids: string, _args: ValidationArguments) {
    try {
      const idArray = ids.split(',').map((id) => +id);
      const rbacRecords = await this.prismaService.rbac.findMany({
        where: { id: { in: idArray } },
      });
      return rbacRecords.length === idArray.length;
    } catch {
      return false;
    }
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.multipleRbacIdsShouldExist();
  }
}
