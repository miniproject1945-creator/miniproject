import { ReviewController } from "@/controllers/review.controller";
import { userGuard, verifyToken } from "@/middlewares/auth.middleware";
import { Router } from "express";
export class reviewRouter {
    router;
    reviewController;
    constructor() {
        this.router = Router();
        this.reviewController = new ReviewController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", verifyToken, userGuard, this.reviewController.createFeedback);
    }
    getRouter() {
        return this.router;
    }
}
