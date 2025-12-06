"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.get("/profile", auth_middleware_1.verifyToken, user_controller_1.getProfileController);
exports.default = userRouter;
