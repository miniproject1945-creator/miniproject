"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const ErrorMiddleware = (error, req, res, next) => {
    // Error dari validasi Zod
    if (error instanceof zod_1.ZodError) {
        let errorsMsg = "";
        error.errors.forEach((err) => {
            errorsMsg += `[x] ${err.message}\n`;
        });
        return res
            .status(400)
            .send((0, response_1.responseWithoutData)(400, false, errorsMsg.trim()));
    }
    if ((0, error_1.isCustomError)(error)) {
        return res
            .status(error.status)
            .send((0, response_1.responseWithoutData)(error.status, false, error.message));
    }
    if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        return res
            .status(401)
            .send((0, response_1.responseWithoutData)(401, false, "Invalid or expired token"));
    }
    return res
        .status(500)
        .send((0, response_1.responseWithoutData)(500, false, error.message || "Internal Server Error"));
};
exports.ErrorMiddleware = ErrorMiddleware;
