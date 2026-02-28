import { Prisma } from '../../prisma-generated/client';
import { GetListDto } from '../core/dto/get-list.dto';

type GenericObject = Record<string, unknown>;

export function buildPrismaGetListQuery<T extends GenericObject>(
  payload: GetListDto,
  currentConditions?: T,
) {
  // Initialize conditions
  const initialConditions: Prisma.UserFindManyArgs = {
    where: undefined,
    select: undefined,
    omit: undefined,
    include: undefined,
    orderBy: undefined,
    cursor: undefined,
    take: undefined,
    skip: undefined,
    distinct: undefined,
  };

  const conditions = {
    ...initialConditions,
    ...currentConditions,
  } as GenericObject;

  // Build pagination condition
  if (payload.page !== undefined && payload.limit !== undefined) {
    conditions['skip'] = (payload.page - 1) * payload.limit;
    conditions['take'] = payload.limit;
  }

  // Build sorting condition
  if (payload.sortField && payload.sortOrder) {
    const orderBy = payload.sortField;
    const orderBySplitted = orderBy.split('.').reverse();
    const nestedOrderBy = orderBySplitted.reduce((result, current, index) => {
      if (index === 0) {
        result[current] = payload.sortOrder;
        return result;
      }
      return { [current]: result };
    }, {});

    conditions['orderBy'] = nestedOrderBy;
  }

  return conditions as T;
}

export function buildPrismaQuery<T extends GenericObject>(): T {
  // Initialize conditions
  const initialConditions: Prisma.UserFindFirstArgs = {
    where: undefined,
    select: undefined,
    omit: undefined,
    include: undefined,
    orderBy: undefined,
    cursor: undefined,
    take: undefined,
    skip: undefined,
    distinct: undefined,
  };

  return initialConditions as unknown as T;
}

export function buildPrismaUpdateQuery<T extends GenericObject>(): T {
  // Initialize conditions
  const initialConditions: Prisma.UserUpdateArgs = {
    where: undefined,
    data: undefined,
    select: undefined,
    omit: undefined,
    include: undefined,
  };

  return initialConditions as unknown as T;
}

export function buildPrismaUpdateManyQuery<T extends GenericObject>(): T {
  // Initialize conditions
  const initialConditions: Prisma.UserUpdateManyArgs = {
    where: undefined,
    data: undefined,
    limit: undefined,
  };

  return initialConditions as unknown as T;
}

export function buildPrismaUpsertQuery<T extends GenericObject>(): T {
  // Initialize conditions
  const initialConditions: Prisma.UserUpsertArgs = {
    where: undefined,
    create: undefined,
    update: undefined,
    select: undefined,
    omit: undefined,
    include: undefined,
  };

  return initialConditions as unknown as T;
}

export function buildPrismaDeleteQuery<T extends GenericObject>(): T {
  // Initialize conditions
  const initialConditions: Prisma.UserDeleteArgs = {
    where: undefined,
    select: undefined,
    omit: undefined,
    include: undefined,
  };

  return initialConditions as unknown as T;
}

export function buildPrismaDeleteManyQuery<T extends GenericObject>(): T {
  // Initialize conditions
  const initialConditions: Prisma.UserDeleteManyArgs = {
    where: undefined,
    limit: undefined,
  };

  return initialConditions as unknown as T;
}
