"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = require("express");
const reviewRouter = (0, express_1.Router)();
reviewRouter.post("/", auth_middleware_1.verifyToken, auth_middleware_1.userGuard, review_controller_1.createFeedbackController);
exports.default = reviewRouter;
