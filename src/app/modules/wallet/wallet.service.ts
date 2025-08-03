import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "./wallet.model";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";
import { WalletStatus } from "./wallet.interface";
import { Transaction } from "../transaction/transaction.model";
import { TransactionType } from "../transaction/transaction.interface";

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
  console.log("isWalletExist from top up wallet service", isWalletExist);

  // Check if the wallet is blocked
  if (isWalletExist.status === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Wallet is blocked. Cannot top up"
    );
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

  const transaction = await Transaction.create({
    initiator: isWalletExist.user,
    type: TransactionType.TOP_UP,
    amount,
    description: `Top up of ${amount} to wallet`,
  });

  return {
    updatedWallet,
    transaction,
  };
};

const sendWallet = async (
  receiverId: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  console.log("userId from send wallet service", receiverId);
  console.log("decodedToken from send wallet service", decodedToken);

  // Find the receiver wallet by receiverId
  const isReceiverWalletExist = await Wallet.findOne({ user: receiverId });
  if (!isReceiverWalletExist) {
    throw new Error("Receiver wallet not found.");
  }

  // Find the sender wallet by userId
  const senderId = decodedToken.userId;
  const isSenderWalletExist = await Wallet.findOne({ user: senderId });
  if (!isSenderWalletExist) {
    throw new Error("Sender wallet not found.");
  }

  // Check if the receiver wallet is blocked
  if (isReceiverWalletExist.status === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Receiver Wallet is blocked. Cannot send."
    );
  }

  // Check if the sender wallet is blocked
  if (isSenderWalletExist.status === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Sender wallet is blocked. Cannot send."
    );
  }

  if (senderId === receiverId && decodedToken.role !== Role.USER) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized! Only owner can send from their wallet!"
    );
    // throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
  }

  // Validate amount
  if (amount <= 0 || amount > isSenderWalletExist.balance) {
    throw new Error("Invalid send amount.");
  }

  // Update the wallet balance
  isSenderWalletExist.balance -= amount;
  isReceiverWalletExist.balance += amount;

  // Save the updated wallet
  await isSenderWalletExist.save();
  await isReceiverWalletExist.save();

  return {
    senderWallet: isSenderWalletExist,
    receiverWallet: isReceiverWalletExist,
  };
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

  // Check if the wallet is blocked
  if (isWalletExist.status === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Wallet is blocked. Cannot withdraw."
    );
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

const statusWallet = async (
  userId: string,
  status: string,
  decodedToken: JwtPayload
) => {
  console.log("userId from status wallet service", userId);
  console.log("decodedToken from status wallet service", decodedToken);

  // Find the wallet by userId
  const isWalletExist = await Wallet.findOne({ user: userId });
  if (!isWalletExist) {
    throw new Error("Wallet not found for the specified user.");
  }

  // only admins can change the status of wallet
  if (
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized! Only admins can change the wallet status!"
    );
  }

  // Update the wallet status
  isWalletExist.status = status as WalletStatus;

  // Save the updated wallet
  const updatedWallet = await isWalletExist.save();
  return updatedWallet;
};

export const WalletServices = {
  getWallets,
  topUpWallet,
  withdrawWallet,
  statusWallet,
  sendWallet,
};
