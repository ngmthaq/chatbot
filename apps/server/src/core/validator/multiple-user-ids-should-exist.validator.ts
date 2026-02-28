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
export class MultipleUserIdsShouldExist implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(ids: string, _args: ValidationArguments) {
    const idArray = ids.split(',').map((id) => Number(id));
    const users = await this.prismaService.user.findMany({
      where: { id: { in: idArray } },
    });
    return users.length === idArray.length;
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.multipleUserIdsShouldExist();
  }
}
