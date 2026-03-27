// middleware/ErrorMiddleware.ts
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { isCustomError } from "../utils/error";
import { responseWithoutData } from "../utils/response";

export const ErrorMiddleware = (
  error: Error, 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Error dari validasi Zod
  if (error instanceof ZodError) {
    let errorsMsg = "";
    error.errors.forEach((err) => {
      errorsMsg += `[x] ${err.message}\n`;
    });

    return res
      .status(400)
      .send(responseWithoutData(400, false, errorsMsg.trim()));
  }

  if (isCustomError(error)) {
    return res
      .status(error.status)
      .send(responseWithoutData(error.status, false, error.message));
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return res
      .status(401)
      .send(responseWithoutData(401, false, "Invalid or expired token"));
  }

  return res
    .status(500)
    .send(responseWithoutData(500, false, error.message || "Internal Server Error"));
};
