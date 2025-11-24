import { AuthService } from '@/services/auth.service';
import { Decoded, LoginRequest, RegisterRequest } from '@/types/auth.type';
import { NextFunction, Request, Response } from 'express';

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as RegisterRequest;
      const response = await AuthService.register(request);

      return res.status(201).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as LoginRequest;
      const response = await AuthService.login(request);

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async keepLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const decoded = res.locals.decoded as Decoded;
      const response = await AuthService.keepLogin(decoded);

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}