/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully!",
      data: user,
    });
  }
);

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully!",
      data: users,
      meta: {
        total: users.length,
      },
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User updated successfully!",
      data: user,
    });
  }
);

export const UserControllers = {
  createUser,
  getUsers,
  updateUser,
};
