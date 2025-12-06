import { UserController } from "@/controllers/user.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
import { Router } from "express";
export class userRouter {
    router;
    userController;
    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/profile", verifyToken, this.userController.getProfile);
    }
    getRouter() {
        return this.router;
    }
}
