"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.get("/", (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), transaction_controller_1.TransactionController.getTransactions);
router.get("/me", (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), transaction_controller_1.TransactionController.getTransactionMe);
exports.TransactionRoutes = router;
