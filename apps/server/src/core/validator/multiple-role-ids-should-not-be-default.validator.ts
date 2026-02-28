import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { DefaultRole } from '../../feature/role/default-role';
import { PrismaService } from '../database/prisma.service';
import { ExceptionDict } from '../exception/exception-dict';

@Injectable()
@ValidatorConstraint({ async: true })
export class MultipleRoleIdsShouldNotBeDefault implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(ids: string, _args: ValidationArguments) {
    try {
      const idArray = ids.split(',').map((id) => +id);
      const roles = await this.prismaService.role.findMany({
        where: { id: { in: idArray } },
      });
      const defaultRoleNames = Object.values(DefaultRole) as string[];
      return !roles.some((role) => defaultRoleNames.includes(role.name));
    } catch {
      return false;
    }
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.roleIdShouldNotBeDefault();
  }
}
