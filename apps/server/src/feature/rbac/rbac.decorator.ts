import { SetMetadata } from '@nestjs/common';

import { Action } from './action';
import { Module } from './module';

export const RBAC_KEY = 'rbacDecorator';
export const Rbac = (module: Module, action: Action) => {
  return SetMetadata(RBAC_KEY, JSON.stringify({ module, action }));
};
