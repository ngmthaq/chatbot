import type { User, Role } from './auth-types';

export enum Module {
  USERS = 'USERS',
  RBAC = 'RBAC',
  ROLES = 'ROLES',
  CHAT = 'CHAT',
  DOCUMENTS = 'DOCUMENTS',
  ADMIN = 'ADMIN',
}

export enum Action {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  LOCK_UNLOCK = 'LOCK_UNLOCK',
}

export interface Rbac {
  id: number;
  roleId: number;
  module: Module;
  action: Action;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface UserWithRole extends User {
  role: Role;
}

export interface CreateUserDto {
  email: string;
  name?: string;
  password: string;
  roleId: number;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface UpdateUserDto extends Partial<
  Omit<CreateUserDto, 'password'>
> {
  id: number;
  password?: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto extends CreateRoleDto {
  id: number;
}

export interface CreateRbacDto {
  roleId: number;
  module: Module;
  action: Action;
}

export interface UpdateRbacDto {
  roleId: number;
  permissions: Array<{
    module: Module;
    action: Action;
    enabled: boolean;
  }>;
}

export interface TokenUsageStats {
  date: string;
  totalTokens: number;
  userCount?: number;
  messageCount?: number;
}

export interface AnalyticsData {
  tokenUsage: TokenUsageStats[];
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  totalConversations: number;
  totalDocuments: number;
  documentsByStatus: Record<string, number>;
}
