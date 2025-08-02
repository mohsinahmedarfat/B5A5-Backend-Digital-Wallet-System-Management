import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "./wallet.model";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";

const getWallets = async () => {
  // populate the user field with user details
  const wallets = await Wallet.find().populate(
    "user",
    "name email role isBlocked"
  );

  return wallets;
};

const topUpWallet = async (
  userId: string,
  amount: number,
  decodedToken: JwtPayload
) => {
    console.log("userId from top up wallet service", userId);
    console.log("decodedToken from top up wallet service", decodedToken);
    // Find the wallet by userId
  const isWalletExist = await Wallet.findOne({ user: userId });
  if (!isWalletExist) {
    throw new Error("Wallet not found for the specified user.");
  }

  // only current user can update their own information
  if (decodedToken.userId !== userId && decodedToken.role !== Role.AGENT) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized! Only owner or agents can top-up to wallet!"
    );
    // throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
  }

  // Validate amount
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  // Update the wallet balance
  isWalletExist.balance += amount;
  // Save the updated wallet
  const updatedWallet = await isWalletExist.save();
  return updatedWallet;
};

const withdrawWallet = async (
  userId: string,
  amount: number,
  decodedToken: JwtPayload
) => {
    console.log("userId from withdraw wallet service", userId);
    console.log("decodedToken from withdraw wallet service", decodedToken);
    // Find the wallet by userId
  const isWalletExist = await Wallet.findOne({ user: userId });
  if (!isWalletExist) {
    throw new Error("Wallet not found for the specified user.");
  }

  // only current user can update their own information
  if (decodedToken.userId !== userId && decodedToken.role !== Role.AGENT) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized! Only owner or agents can withdraw from wallet!"
    );
    // throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
  }

  // Validate amount
  if (amount <= 0 || amount > isWalletExist.balance) {
    throw new Error("Invalid withdrawal amount.");
  }

  // Update the wallet balance
  isWalletExist.balance -= amount;
  // Save the updated wallet
  const updatedWallet = await isWalletExist.save();
  return updatedWallet;
};

export const WalletServices = {
  getWallets,
  topUpWallet,
  withdrawWallet
};
