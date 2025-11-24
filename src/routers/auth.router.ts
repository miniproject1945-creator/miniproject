import { AuthController } from '@/controllers/auth.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.authController.register);
    this.router.post('/login', this.authController.login);
    this.router.get('/keep-login', verifyToken, this.authController.keepLogin);
  }

  public getRoutes(): Router {
    return this.router;
  }
}