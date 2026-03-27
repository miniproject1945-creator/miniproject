import { AuthController } from '@/controllers/auth.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';
export class AuthRouter {
    router;
    authController;
    constructor() {
        this.router = Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/register', this.authController.register);
        this.router.post('/login', this.authController.login);
        this.router.get('/keep-login', verifyToken, this.authController.keepLogin);
    }
    getRoutes() {
        return this.router;
    }
}
