/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { WalletServices } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";

const getWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallets = await WalletServices.getWallets();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallets retrieved successfully.",
      data: wallets,
    });
  }
);

const topUpWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { amount } = req.body;
    const verifiedToken = req.user;

    // Call service to top up wallet
    const updatedWallet = await WalletServices.topUpWallet(
      userId,
      amount,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallet topped up successfully.",
      data: updatedWallet,
    });
  }
);

const withdrawWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { amount } = req.body;
    const verifiedToken = req.user;

    // Call service to withdraw from wallet
    const updatedWallet = await WalletServices.withdrawWallet(
      userId,
      amount,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Withdrawal successful.",
      data: updatedWallet,
    });
  }
);

export const WalletController = {
  getWallets,
  topUpWallet,
  withdrawWallet
};
