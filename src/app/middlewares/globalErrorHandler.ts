import { Request, Response } from "express";
import envVars from "../config/env";
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (
  err: unknown, // unknown instead of any => More type-safe for errors
  req: Request,
  res: Response
) => {
  const isDev = envVars.NODE_ENV === "development";
  if (isDev) console.error(err);

  let statusCode = 500;
  let message = "Something went wrong!!";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: isDev && err instanceof Error ? err.stack : undefined,
  });
};
