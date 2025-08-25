import AppError from "../../errorHelpers/appError";
import { ApprovalStatus, IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/env";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  // Check if user already exists
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User already exists with this email."
    );
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auth: [authProvider],
    ...rest,
  });

  // Create wallet and connect
  const wallet = await Wallet.create({ user: user._id });

  // Update user with wallet ID
  user.wallet = wallet._id;
  await user.save();

  console.log("object from create user service", user);
  console.log("wallet from create user service", wallet);

  return user;
};

const getUsers = async () => {
  const users = await User.find();
  return users;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  console.log("payload from update user service", payload);
  console.log("decodedToken from update user service", decodedToken);

  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if the user is trying to update their own role or blocked status
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

  // Check if the user is trying to block or unblock themselves
  if (payload.isBlocked) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

  // only current user can update their own information
  if (
    decodedToken.userId !== userId &&
    decodedToken.role !== Role.SUPER_ADMIN &&
    decodedToken.role !== Role.ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only change your info. Not others!"
    );
    // throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
  }

  // Check if the user is trying to change approval status
  if (payload.approvalStatus) {
    if (
      payload.approvalStatus !== ApprovalStatus.PENDING &&
      decodedToken.role === Role.USER
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change approval status to APPROVED or SUSPENDED!"
      );
    }

    // Auto-update role based on approvalStatus
    if (payload.approvalStatus === "APPROVED" || payload.approvalStatus === "SUSPENDED") {
      // Admin approves request
      payload.role = Role.AGENT;
    }
  }

  // If the user is trying to update their own password, hash it
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

const statusUser = async (
  userId: string,
  isBlocked: boolean,
  decodedToken: JwtPayload
) => {
  console.log("userId from status User service", userId);
  console.log("decodedToken from status User service", decodedToken);

  // Find the User by userId
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new Error("User not found for the specified user.");
  }

  // only admins can change the status of User
  if (
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized! Only admins can change the User status!"
    );
  }

  // Update the User status
  isUserExist.isBlocked = isBlocked;

  // Save the updated User
  const updatedUser = await isUserExist.save();
  return updatedUser;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  getUsers,
  updateUser,
  statusUser,
  getMe
};
