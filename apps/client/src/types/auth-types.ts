export enum DefaultRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  roleId: number;
  activatedAt?: string;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  _count?: {
    users: number;
    rbac: number;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

export interface UserProfile extends User {
  role: Role;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}
