/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import setCookie from "../../utils/setCookies";
import { createUserTokens } from "../../utils/userTokens";
import envVars from "../../config/env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const logInfo = await AuthServices.credentialsLogin(req.body);

    setCookie(res, logInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully!",
      data: logInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "No refresh token received from cookies!"
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully!",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged out successfully!",
      data: null,
    });
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    console.log("user from google callback", user);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    const tokenInfo = createUserTokens(user);

    setCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  googleCallback,
};
