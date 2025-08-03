/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TransactionServices } from "./transaction.service";
import httpStatus from "http-status-codes";

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

export const TransactionController = {
  getTransactions,
};
