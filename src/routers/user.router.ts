import { getProfileController } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/profile", verifyToken, getProfileController);

export default userRouter;

