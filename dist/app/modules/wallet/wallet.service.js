"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletServices = void 0;
const wallet_model_1 = require("./wallet.model");
const user_interface_1 = require("../user/user.interface");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const user_model_1 = require("../user/user.model");
const getWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    // populate the user field with user details
    const wallets = yield wallet_model_1.Wallet.find().populate("user", "name email role isBlocked");
    return wallets;
});
const topUpWallet = (userId, amount, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userId from top up wallet service", userId);
    console.log("decodedToken from top up wallet service", decodedToken);
    // Find the receiver wallet by receiverId
    const isReceiverWalletExist = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!isReceiverWalletExist) {
        throw new Error("Receiver wallet not found.");
    }
    console.log("isReceiverWalletExist from top up wallet service", isReceiverWalletExist);
    // Find the agent wallet by userId
    const agentId = decodedToken.userId;
    const isAgentWalletExist = yield wallet_model_1.Wallet.findOne({ user: agentId });
    if (!isAgentWalletExist) {
        throw new Error("Agent wallet not found.");
    }
    // Check if the wallet is blocked
    if (isReceiverWalletExist.status === "BLOCKED") {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Wallet is blocked. Cannot top up");
    }
    // only current user can update their own information
    if (decodedToken.userId !== userId && decodedToken.role !== user_interface_1.Role.AGENT) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized! Only owner or agents can top-up to wallet!");
    }
    // agent (current user) can not update their wallet balance
    if (decodedToken.userId === userId) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You can not update your wallet balance!");
    }
    // Validate amount
    if (amount <= 0 || amount > isAgentWalletExist.balance) {
        throw new Error("Invalid send amount.");
    }
    // Update the wallet balance
    isAgentWalletExist.balance -= amount;
    isReceiverWalletExist.balance += amount;
    // Save the updated wallet
    const agentWallet = yield isAgentWalletExist.save();
    const receiverWallet = yield isReceiverWalletExist.save();
    const transaction = yield transaction_model_1.Transaction.create({
        initiator: agentId,
        recipient: userId,
        type: transaction_interface_1.TransactionType.TOP_UP,
        amount,
        description: `Top up ${amount} to wallet`,
    });
    return {
        agentWallet,
        receiverWallet,
        transaction,
    };
});
const sendWallet = (receiverId, amount, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userId from send wallet service", receiverId);
    console.log("decodedToken from send wallet service", decodedToken);
    const isUserExist = yield user_model_1.User.findById(receiverId);
    if (!isUserExist) {
        throw new Error("User does not exist.");
    }
    // Find the receiver wallet by receiverId
    const isReceiverWalletExist = yield wallet_model_1.Wallet.findOne({ user: receiverId });
    if (!isReceiverWalletExist) {
        throw new Error("Receiver wallet not found.");
    }
    // Find the sender wallet by userId
    const senderId = decodedToken.userId;
    const isSenderWalletExist = yield wallet_model_1.Wallet.findOne({ user: senderId });
    if (!isSenderWalletExist) {
        throw new Error("Sender wallet not found.");
    }
    // Check if the receiver wallet is blocked
    if (isReceiverWalletExist.status === "BLOCKED") {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Receiver Wallet is blocked. Cannot send.");
    }
    // Check if the sender wallet is blocked
    if (isSenderWalletExist.status === "BLOCKED") {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Sender wallet is blocked. Cannot send.");
    }
    if (senderId === receiverId && decodedToken.role !== user_interface_1.Role.USER) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized! Only owner can send from their wallet!");
    }
    // user can not send money to agent
    if (decodedToken.role === user_interface_1.Role.USER && isUserExist.role === user_interface_1.Role.AGENT) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "User can not send money to agent.");
    }
    // agent can not send money to anyone
    if (decodedToken.role === user_interface_1.Role.AGENT) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Agent can not send money to anyone.");
    }
    // Validate amount
    if (amount <= 0 || amount > isSenderWalletExist.balance) {
        throw new Error("Invalid send amount.");
    }
    // Update the wallet balance
    isSenderWalletExist.balance -= amount;
    isReceiverWalletExist.balance += amount;
    // Save the updated wallet
    const senderWallet = yield isSenderWalletExist.save();
    const receiverWallet = yield isReceiverWalletExist.save();
    const transaction = yield transaction_model_1.Transaction.create({
        initiator: senderId,
        recipient: receiverId,
        type: transaction_interface_1.TransactionType.SEND,
        amount,
        description: `Send ${amount} to wallet`,
    });
    return {
        senderWallet,
        receiverWallet,
        transaction,
    };
});
const withdrawWallet = (userId, amount, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userId from top up wallet service", userId);
    console.log("decodedToken from top up wallet service", decodedToken);
    // Find the User wallet by UserId
    const isUserWalletExist = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!isUserWalletExist) {
        throw new Error("User wallet not found.");
    }
    console.log("isUserWalletExist from top up wallet service", isUserWalletExist);
    // Find the agent wallet by userId
    const agentId = decodedToken.userId;
    const isAgentWalletExist = yield wallet_model_1.Wallet.findOne({ user: agentId });
    if (!isAgentWalletExist) {
        throw new Error("Agent wallet not found.");
    }
    // Check if the wallet is blocked
    if (isUserWalletExist.status === "BLOCKED") {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Wallet is blocked. Cannot top up");
    }
    // only current user can update their own information
    if (decodedToken.userId !== userId && decodedToken.role !== user_interface_1.Role.AGENT) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized! Only owner or agents can withdraw from wallet!");
    }
    // agent (current user) can not update their wallet balance
    if (decodedToken.userId === userId) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You can not update your wallet balance!");
    }
    // Validate amount
    if (amount <= 0 || amount > isUserWalletExist.balance) {
        throw new Error("Invalid withdrawal amount.");
    }
    // Update the wallet balance
    isAgentWalletExist.balance += amount;
    isUserWalletExist.balance -= amount;
    // Save the updated wallet
    const agentWallet = yield isAgentWalletExist.save();
    const userWallet = yield isUserWalletExist.save();
    const transaction = yield transaction_model_1.Transaction.create({
        initiator: userId,
        recipient: agentId,
        type: transaction_interface_1.TransactionType.WITHDRAW,
        amount,
        description: `Withdraw ${amount} to wallet`,
    });
    return {
        agentWallet,
        userWallet,
        transaction,
    };
});
const statusWallet = (userId, status, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userId from status wallet service", userId);
    console.log("decodedToken from status wallet service", decodedToken);
    // Find the wallet by userId
    const isWalletExist = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!isWalletExist) {
        throw new Error("Wallet not found for the specified user.");
    }
    // only admins can change the status of wallet
    if (decodedToken.role !== user_interface_1.Role.ADMIN &&
        decodedToken.role !== user_interface_1.Role.SUPER_ADMIN) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized! Only admins can change the wallet status!");
    }
    // Update the wallet status
    isWalletExist.status = status;
    // Save the updated wallet
    const updatedWallet = yield isWalletExist.save();
    return updatedWallet;
});
const getWalletMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).populate("user", "name email role isBlocked");
    return {
        data: wallet,
    };
});
exports.WalletServices = {
    getWallets,
    topUpWallet,
    withdrawWallet,
    statusWallet,
    sendWallet,
    getWalletMe,
};
