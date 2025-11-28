/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { NotificationServices } from "./notification.service";
import { JwtPayload } from "jsonwebtoken";

const getNotifications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await NotificationServices.getNotifications();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Notifications retrieved successfully.",
      data: notifications,
    });
  }
);

const getNotificationMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await NotificationServices.getNotificationMe(decodedToken.userId);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your Notifications Retrieved Successfully",
        data: result.data
    })
})

export const NotificationController = {
  getNotifications,
  getNotificationMe
};