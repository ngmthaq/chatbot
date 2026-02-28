import { Injectable, Logger } from '@nestjs/common';

import { Prisma } from '../../../prisma-generated/client';
import { PrismaService } from '../../core/database/prisma.service';
import { EncryptService } from '../../core/encrypt/encrypt.service';
import { ResponseBuilder } from '../../core/response/response-builder';
import dayjs from '../../utils/date';
import { buildPrismaGetListQuery } from '../../utils/prisma';

import { CreateUserDto } from './create-user.dto';
import { GetUserListDto } from './get-user-list.dto';
import { IdParamDto } from './id-param.dto';
import { MultipleIdsParamDto } from './multiple-ids-param.dto';
import { generateStrongPassword } from './strong-password-options';
import { UpdateUserDto } from './update-user.dto';
import { UserEntity } from './user-entity';
import { UserGender } from './user-gender';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptService,
  ) {}

  public async getUsers(params: GetUserListDto) {
    const builder = buildPrismaGetListQuery<Prisma.UserFindManyArgs>(params);
    builder.include = { role: true };
    builder.where = { OR: [] };
    if (params.search) {
      builder.where.OR.push({ name: { contains: params.search } });
      builder.where.OR.push({ email: { contains: params.search } });
      builder.where.OR.push({ phone: { contains: params.search } });
      builder.where.OR.push({ address: { contains: params.search } });
      builder.where.OR.push({ role: { name: { contains: params.search } } });
    }
    if (params.isActivated !== undefined) {
      builder.where.activatedAt = params.isActivated ? { not: null } : null;
    }

    const users = await this.prismaService.user.findMany(builder);
    return ResponseBuilder.data(users.map((user) => new UserEntity(user)));
  }

  public async getUserById(params: IdParamDto) {
    const user = await this.prismaService.user.findFirst({
      where: { id: params.id },
      include: { role: true },
    });
    return ResponseBuilder.data(user ? new UserEntity(user) : null);
  }

  public getUserGenders() {
    return ResponseBuilder.data(Object.values(UserGender));
  }

  public async createUser(data: CreateUserDto) {
    const password = data.password || generateStrongPassword();
    const hashedPassword = await this.encryptionService.hash(password);
    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
        activatedAt: dayjs().toDate(),
      },
    });
    this.logger.log(
      `TODO: Send activation email to user with email: ${user.email} and password: ${password}`,
    );
    return ResponseBuilder.data(new UserEntity(user));
  }

  public async updateUser(params: IdParamDto, data: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: { id: params.id },
      data,
    });
    return ResponseBuilder.data(new UserEntity(user));
  }

  public async lockUser(params: IdParamDto) {
    const user = await this.prismaService.user.update({
      where: { id: params.id },
      data: { lockedAt: dayjs().toDate() },
    });
    return ResponseBuilder.data(new UserEntity(user));
  }

  public async unlockUser(params: IdParamDto) {
    const user = await this.prismaService.user.update({
      where: { id: params.id },
      data: { lockedAt: null },
    });
    return ResponseBuilder.data(new UserEntity(user));
  }

  public async deleteUser(params: IdParamDto) {
    const user = await this.prismaService.user.delete({
      where: { id: params.id },
    });
    return ResponseBuilder.data(new UserEntity(user));
  }

  public async deleteMultipleUsers(params: MultipleIdsParamDto) {
    const ids = params.ids.split(',').map((id) => +id);
    const users = await this.prismaService.user.deleteMany({
      where: { id: { in: ids } },
    });
    return ResponseBuilder.data({ deletedCount: users.count });
  }
}
