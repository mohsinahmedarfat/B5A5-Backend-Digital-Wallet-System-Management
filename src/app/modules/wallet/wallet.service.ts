import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "./wallet.model";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";
import { WalletStatus } from "./wallet.interface";
import { Transaction } from "../transaction/transaction.model";
import { TransactionType } from "../transaction/transaction.interface";
import { User } from "../user/user.model";

const getWallets = async () => {
  // populate the user field with user details
  const wallets = await Wallet.find().populate(
    "user",
    "name email role isBlocked"
  );

  return wallets;
};

const topUpWallet = async (
  userEmail: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  console.log("userId from top up wallet service", userEmail);
  console.log("decodedToken from top up wallet service", decodedToken);

  const isUserExist = await User.findOne({ email: userEmail });
  console.log("isUserExist", isUserExist);
  if (!isUserExist) {
    throw new Error("User does not exist.");
  }

  // Find the receiver wallet by receiverId
  const isReceiverWalletExist = await Wallet.findOne({ user: isUserExist._id });
  if (!isReceiverWalletExist) {
    throw new Error("Receiver wallet not found.");
  }
  console.log(
    "isReceiverWalletExist from top up wallet service",
    isReceiverWalletExist
  );

  // Find the agent wallet by userId
  const agentId = decodedToken.userId;
  const isAgentWalletExist = await Wallet.findOne({ user: agentId });
  if (!isAgentWalletExist) {
    throw new Error("Agent wallet not found.");
  }

  // Check if the wallet is blocked
  if (isReceiverWalletExist.status === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Wallet is blocked. Cannot top up"
    );
  }

  // only current user can update their own information
  if (
    decodedToken.userId !== isUserExist._id &&
    decodedToken.role !== Role.AGENT
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized! Only owner or agents can top-up to wallet!"
    );
  }

  // agent (current user) can not update their wallet balance
  if (decodedToken.userId === isUserExist._id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can not update your wallet balance!"
    );
  }

  // Validate amount
  if (amount <= 0 || amount > isAgentWalletExist.balance) {
    throw new Error("Invalid send amount.");
  }

  // Update the wallet balance
  isAgentWalletExist.balance -= amount;
  isReceiverWalletExist.balance += amount;

  // Save the updated wallet
  const agentWallet = await isAgentWalletExist.save();
  const receiverWallet = await isReceiverWalletExist.save();

  const transaction = await Transaction.create({
    initiator: agentId,
    recipient: isUserExist._id,
    type: TransactionType.TOP_UP,
    amount,
    description: `Top up ${amount} to wallet`,
  });

  return {
    agentWallet,
    receiverWallet,
    transaction,
  };
};

const sendWallet = async (
  receiverEmail: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  console.log("userId from send wallet service", receiverEmail);
  console.log("decodedToken from send wallet service", decodedToken);

  const isUserExist = await User.findOne({ email: receiverEmail });
  console.log(isUserExist);
  if (!isUserExist) {
    throw new Error("User does not exist.");
  }

  // Find the receiver wallet by receiverId
  const isReceiverWalletExist = await Wallet.findOne({ user: isUserExist._id });
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

  if (senderId === isUserExist._id && decodedToken.role !== Role.USER) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized! Only owner can send from their wallet!"
    );
  }

  // user can not send money to agent
  if (decodedToken.role === Role.USER && isUserExist.role === Role.AGENT) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User can not send money to agent."
    );
  }

  // agent can not send money to anyone
  if (decodedToken.role === Role.AGENT) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Agent can not send money to anyone."
    );
  }
  
  // user can not send money to its account
  if (decodedToken.email === receiverEmail) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User can not send money to its account."
    );
  }

  // Validate amount
  if (amount <= 0 || amount > isSenderWalletExist.balance) {
    throw new Error("Invalid send amount.");
  }

  // Update the wallet balance
  isSenderWalletExist.balance -= amount;
  isReceiverWalletExist.balance += amount;

  // Save the updated wallet
  const senderWallet = await isSenderWalletExist.save();
  const receiverWallet = await isReceiverWalletExist.save();

  const transaction = await Transaction.create({
    initiator: senderId,
    recipient: isUserExist._id,
    type: TransactionType.SEND,
    amount,
    description: `Send ${amount} to wallet`,
  });

  return {
    senderWallet,
    receiverWallet,
    transaction,
  };
};

const withdrawWallet = async (
  agentEmail: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  console.log("agentEmail from top up wallet service", agentEmail);
  console.log("decodedToken from top up wallet service", decodedToken);

  const isAgentExist = await User.findOne({ email: agentEmail });
  console.log("isAgentExist", isAgentExist);
  if (!isAgentExist) {
    throw new Error("User does not exist.");
  }

  // Find the User wallet by userEmail
  const isAgentWalletExist = await Wallet.findOne({ user: isAgentExist._id });
  if (!isAgentWalletExist) {
    throw new Error("User wallet not found.");
  }
  console.log(
    "isUserWalletExist from top up wallet service",
    isAgentWalletExist
  );

  // Find the agent wallet by userId
  const userId = decodedToken.userId;
  const isUserWalletExist = await Wallet.findOne({ user: userId });
  if (!isUserWalletExist) {
    throw new Error("Agent wallet not found.");
  }

  // Check if the user wallet is blocked
  if (isUserWalletExist.status === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Wallet is blocked. Cannot top up"
    );
  }
  
  // Check if the agent wallet is blocked
  if (isAgentWalletExist.status === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Wallet is blocked. Cannot top up"
    );
  }

  // only current user can update their own information
  if (userId !== isAgentExist._id && decodedToken.role !== Role.USER) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized! Only owner or agents can withdraw from wallet!"
    );
  }

  // user can not withdraw money from a other user. user can only withdraw money from agent
  if (decodedToken.role === Role.USER && isAgentExist.role === Role.USER) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User can not withdraw money from another user."
    );
  }

  // agent (current user) can not update their wallet balance
  if (decodedToken.email === agentEmail) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can not update your wallet balance!"
    );
  }

  // Validate amount
  if (amount <= 0 || amount > isUserWalletExist.balance) {
    throw new Error("Invalid withdrawal amount.");
  }

  // Update the wallet balance
  isAgentWalletExist.balance += amount;
  isUserWalletExist.balance -= amount;

  // Save the updated wallet
  const agentWallet = await isAgentWalletExist.save();
  const userWallet = await isUserWalletExist.save();

  const transaction = await Transaction.create({
    initiator: userId,
    recipient: isAgentExist._id,
    type: TransactionType.WITHDRAW,
    amount,
    description: `Withdraw ${amount} to wallet`,
  });

  return {
    agentWallet,
    userWallet,
    transaction,
  };
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

const getWalletMe = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId }).populate(
    "user",
    "name email role isBlocked"
  );
  return {
    data: wallet,
  };
};

export const WalletServices = {
  getWallets,
  topUpWallet,
  withdrawWallet,
  statusWallet,
  sendWallet,
  getWalletMe,
};
