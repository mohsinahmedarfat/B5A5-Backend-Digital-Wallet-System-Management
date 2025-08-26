/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TransactionServices } from "./transaction.service";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const getTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await TransactionServices.getTransactions();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Transactions retrieved successfully.",
      data: transactions,
    });
  }
);

const getTransactionMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await TransactionServices.getTransactionMe(decodedToken.userId);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your Transaction Retrieved Successfully",
        data: result.data
    })
})

export const TransactionController = {
  getTransactions,
  getTransactionMe
};
