import { ErrorResponse } from '@/utils/error';
import { verifyJWTToken } from '@/utils/jwt';
import { NextFunction, Request, Response } from 'express';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) throw new ErrorResponse(401, 'Unauthorized');

  const decoded = verifyJWTToken(token);
  if (decoded) res.locals.decoded = decoded;
  next();
};

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.decoded?.isAdmin) {
    throw new ErrorResponse(401, 'Unauthorized');
  }
  next();
};

export const userGuard = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.decoded?.isAdmin) {
    throw new ErrorResponse(401, 'Unauthorized');
  }
  next();
};