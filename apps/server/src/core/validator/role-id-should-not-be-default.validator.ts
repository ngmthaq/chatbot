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
export class RoleIdShouldNotBeDefault implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(id: string, _args: ValidationArguments) {
    try {
      const role = await this.prismaService.role.findFirst({
        where: { id: +id },
      });
      if (!role) return true; // Let RoleIdShouldExist handle this
      const defaultRoleNames = Object.values(DefaultRole) as string[];
      return !defaultRoleNames.includes(role.name);
    } catch {
      return false;
    }
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.roleIdShouldNotBeDefault();
  }
}
