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
export class RoleIdShouldNotHaveRelationships implements ValidatorConstraintInterface {
  public constructor(private readonly prismaService: PrismaService) {}

  public async validate(id: string, _args: ValidationArguments) {
    try {
      const role = await this.prismaService.role.findFirst({
        where: { id: +id },
        include: { users: true, rbac: true },
      });
      if (!role) return true; // Let RoleIdShouldExist handle this
      return role.users.length === 0 && role.rbac.length === 0;
    } catch {
      return false;
    }
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.roleIdShouldNotHaveRelationships();
  }
}
