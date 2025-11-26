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
exports.WalletController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_service_1 = require("./wallet.service");
const getWallets = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_service_1.WalletServices.getWallets();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallets retrieved successfully.",
        data: wallets,
    });
}));
const topUpUserWallet = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.params.userEmail;
    const { amount } = req.body;
    const verifiedToken = req.user;
    // Call service to top up wallet
    const result = yield wallet_service_1.WalletServices.topUpUserWallet(userEmail, amount, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet topped up successfully.",
        data: result,
    });
}));
const topUpAgentWallet = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const agentEmail = req.params.agentEmail;
    console.log("agentEmail-", agentEmail);
    const { amount } = req.body;
    const verifiedToken = req.user;
    // Call service to top up wallet
    const result = yield wallet_service_1.WalletServices.topUpAgentWallet(agentEmail, amount, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet topped up successfully.",
        data: result,
    });
}));
const sendWallet = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverEmail = req.params.receiverEmail;
    const { amount } = req.body;
    const verifiedToken = req.user;
    // Call service to send from wallet
    const result = yield wallet_service_1.WalletServices.sendWallet(receiverEmail, amount, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet sent successfully.",
        data: result,
    });
}));
const withdrawWallet = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const agentEmail = req.params.agentEmail;
    const { amount } = req.body;
    const verifiedToken = req.user;
    // Call service to withdraw from wallet
    const updatedWallet = yield wallet_service_1.WalletServices.withdrawWallet(agentEmail, amount, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Withdrawal successful.",
        data: updatedWallet,
    });
}));
const statusWallet = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const { status } = req.body;
    const verifiedToken = req.user;
    // Call service to update wallet status
    const updatedWallet = yield wallet_service_1.WalletServices.statusWallet(userId, status, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet status updated successfully.",
        data: updatedWallet,
    });
}));
const getWalletMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield wallet_service_1.WalletServices.getWalletMe(decodedToken.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your Wallet Retrieved Successfully",
        data: result.data
    });
}));
exports.WalletController = {
    getWallets,
    topUpUserWallet,
    topUpAgentWallet,
    withdrawWallet,
    statusWallet,
    sendWallet,
    getWalletMe
};
