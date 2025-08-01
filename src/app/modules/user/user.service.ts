import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/env";

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
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

  if (payload.isBlocked) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

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

export const UserServices = {
  createUser,
  getUsers,
  updateUser,
};
