"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = __importDefault(require("../config/env"));
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const zod_1 = require("zod");
const errorFunctions_1 = require("../errorHelpers/errorFunctions");
const globalErrorHandler = (err, req, res, next) => {
    const isDev = env_1.default.NODE_ENV === "development";
    if (isDev)
        console.error(err);
    let statusCode = 500;
    let message = "Something went wrong!!";
    // mongoose duplicate error
    if (err.code === 11000) {
        const simplifiedError = (0, errorFunctions_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // object ID error / cast error
    else if (err.name === "CastError") {
        const simplifiedError = (0, errorFunctions_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // mongoose validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, errorFunctions_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod Validation Error
    else if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, errorFunctions_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Custom AppError
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Regular JavaScript Errors
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources: errorFunctions_1.errorSources,
        err: isDev ? err : null,
        stack: isDev && err instanceof Error ? err.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
