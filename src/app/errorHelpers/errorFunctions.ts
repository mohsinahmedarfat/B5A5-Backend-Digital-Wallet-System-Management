/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces/error.types";

export const errorSources: { path: string; message: string }[] = [];

export const handleDuplicateError = (err: any) => {
  const matchedArray = err.message.match(/"([^"]*)"/);

  return {
    statusCode: 400,
    message: `${matchedArray[1]} already exists!`,
  };
};

export const handleCastError = (
  err: mongoose.Error.CastError
): IErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid MongoDB ObjectID. Please provide a valid ID",
  };
};

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): IErrorResponse => {
  // make objects into array of object
  const errors = Object.values(err.errors);

  errorSources.length = 0;
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation error occurred",
  };
};

export const handleZodError = (err: any): IErrorResponse => {
  errorSources.length = 0;
  err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zod Validation Error!",
  };
};
