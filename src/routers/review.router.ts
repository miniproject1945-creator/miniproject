import { createFeedbackController } from "@/controllers/review.controller";
import { userGuard, verifyToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.post("/", verifyToken, userGuard, createFeedbackController);

export default reviewRouter;
