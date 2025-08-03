"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(error);
    });
    // Promise.resolve(fn(req, res, next)).catch((error: any)=>{
    //   next(error);
    // });
};
exports.default = catchAsync;
