import { keepLoginController, loginController, registerController } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { Router } from 'express';


const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/keep-login",verifyToken, keepLoginController);

export default authRouter;