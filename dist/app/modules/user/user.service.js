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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = __importDefault(require("../../config/env"));
const wallet_model_1 = require("../wallet/wallet.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    // Check if user already exists
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists with this email.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const authProvider = {
        provider: "credential",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auth: [authProvider] }, rest));
    // Create wallet and connect
    const wallet = yield wallet_model_1.Wallet.create({ user: user._id });
    // Update user with wallet ID
    user.wallet = wallet._id;
    yield user.save();
    console.log("object from create user service", user);
    console.log("wallet from create user service", wallet);
    return user;
});
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    return users;
});

const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("payload from update user service", payload);
    console.log("decodedToken from update user service", decodedToken);
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // Check if the user is trying to update their own role or blocked status
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized!");
        }
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized!");
        }
    }
    // Check if the user is trying to block or unblock themselves
    if (payload.isBlocked) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized!");
        }
    }
    // only current user can update their own information
    if (decodedToken.userId !== userId &&
        decodedToken.role !== user_interface_1.Role.SUPER_ADMIN &&
        decodedToken.role !== user_interface_1.Role.ADMIN) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only change your info. Not others!");
        // throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
    // Check if the user is trying to change approval status
    if (payload.approvalStatus) {
        if (payload.approvalStatus !== user_interface_1.ApprovalStatus.PENDING &&
            decodedToken.role === user_interface_1.Role.USER) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to change approval status to APPROVED or SUSPENDED!");
        }
        // Auto-update role based on approvalStatus
        if (payload.approvalStatus === "APPROVED" || payload.approvalStatus === "SUSPENDED") {
            // Admin approves request
            payload.role = user_interface_1.Role.AGENT;
        }
    }
    // If the user is trying to update their own password, hash it
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, env_1.default.BCRYPT_SALT_ROUND);
    }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdateUser;
});
const statusUser = (userId, isBlocked, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userId from status User service", userId);
    console.log("decodedToken from status User service", decodedToken);
    // Find the User by userId
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new Error("User not found for the specified user.");
    }
    // only admins can change the status of User
    if (decodedToken.role !== user_interface_1.Role.ADMIN &&
        decodedToken.role !== user_interface_1.Role.SUPER_ADMIN) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized! Only admins can change the User status!");
    }
    // Update the User status
    isUserExist.isBlocked = isBlocked;
    // Save the updated User
    const updatedUser = yield isUserExist.save();
    return updatedUser;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user,
    };
});
exports.UserServices = {
    createUser,
    getUsers,
    updateUser,
    statusUser,
    getMe
};
