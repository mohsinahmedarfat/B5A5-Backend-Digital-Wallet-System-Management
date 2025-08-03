"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = exports.handleValidationError = exports.handleCastError = exports.handleDuplicateError = exports.errorSources = void 0;
exports.errorSources = [];
const handleDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid ID",
    };
};
exports.handleCastError = handleCastError;
const handleValidationError = (err) => {
    // make objects into array of object
    const errors = Object.values(err.errors);
    exports.errorSources.length = 0;
    errors.forEach((errorObject) => exports.errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
    }));
    return {
        statusCode: 400,
        message: "Validation error occurred",
    };
};
exports.handleValidationError = handleValidationError;
const handleZodError = (err) => {
    exports.errorSources.length = 0;
    err.issues.forEach((issue) => {
        exports.errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        });
    });
    return {
        statusCode: 400,
        message: "Zod Validation Error!",
    };
};
exports.handleZodError = handleZodError;
