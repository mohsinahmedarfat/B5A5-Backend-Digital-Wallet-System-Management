"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const wallet_controller_1 = require("./wallet.controller");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.get("/", (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), wallet_controller_1.WalletController.getWallets);
router.get("/me", (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), wallet_controller_1.WalletController.getWalletMe);
router.patch("/top-up/:userId", (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), wallet_controller_1.WalletController.topUpWallet);
router.patch("/withdraw/:userId", (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), wallet_controller_1.WalletController.withdrawWallet);
router.patch("/send/:receiverId", (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), wallet_controller_1.WalletController.sendWallet);
router.patch("/status/:userId", (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), wallet_controller_1.WalletController.statusWallet);
exports.WalletRoutes = router;
