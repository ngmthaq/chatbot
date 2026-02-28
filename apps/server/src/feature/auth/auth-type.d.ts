import { Request } from 'express';

export type JwtPayload = {
  sub: number;
  email: string;
};

export type AuthRequest = Request & {
  authentication: JwtPayload;
};
