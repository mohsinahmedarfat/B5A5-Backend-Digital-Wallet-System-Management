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

const sendWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const receiverId = req.params.receiverId;
    const { amount } = req.body;
    const verifiedToken = req.user;

    // Call service to send from wallet
    const result = await WalletServices.sendWallet(
      receiverId,
      amount,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallet sent successfully.",
      data: result,
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

const statusWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { status } = req.body;
    const verifiedToken = req.user;

    // Call service to update wallet status
    const updatedWallet = await WalletServices.statusWallet(
      userId,
      status,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallet status updated successfully.",
      data: updatedWallet,
    });
  }
);

export const WalletController = {
  getWallets,
  topUpWallet,
  withdrawWallet,
  statusWallet,
  sendWallet
};
