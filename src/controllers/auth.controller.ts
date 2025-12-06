import { registerService, loginService, keepLoginService } from '@/services/auth.service';
import { Decoded, LoginRequest, RegisterRequest } from '@/types/auth.type';
import { NextFunction, Request, Response } from 'express';


  export async function registerController(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as RegisterRequest;
      const response = await registerService(request);

      return res.status(201).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function loginController(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as LoginRequest;
      const response = await loginService(request);

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function keepLoginController(req: Request, res: Response, next: NextFunction) {
    try {
      const decoded = res.locals.decoded as Decoded;
      const response = await keepLoginService(decoded);

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
