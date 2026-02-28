import { Exclude } from 'class-transformer';

import { Prisma } from '../../../prisma-generated/client';
import { Maybe, Nullable } from '../../types/common';

export class UserEntity implements Prisma.UserModel {
  id: number;
  roleId: number;
  email: string;
  name: Nullable<string>;
  phone: Nullable<string>;
  address: Nullable<string>;
  gender: Nullable<string>;
  dateOfBirth: Nullable<Date>;
  activatedAt: Nullable<Date>;
  lockedAt: Nullable<Date>;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: Maybe<Prisma.TokenModel[]>;

  @Exclude()
  password: string;

  public constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
