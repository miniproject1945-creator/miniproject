import { UserController } from "@/controllers/user.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

export class userRouter {
    private router: Router;
    private userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }   
    private initializeRoutes(): void {
        this.router.get(
            "/profile",
            verifyToken,
            this.userController.getProfile
        );
    }
    public getRouter(): Router {
        return this.router;
    }
}


