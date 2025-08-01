/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/appError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/env";
import { verifyToken } from "../../utils/jwt";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email }).select("+password");
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist!");
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password!");
  }

  const userTokens = createUserTokens(isUserExist);

  // Won't show password in response for security purpose
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return newAccessToken;
  // return {
  //   accessToken: newAccessToken,
  // };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
