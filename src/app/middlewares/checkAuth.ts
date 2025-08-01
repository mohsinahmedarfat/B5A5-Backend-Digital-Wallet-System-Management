import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import envVars from "../config/env";

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Received!");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      // authRoles = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!");
      } 

      req.user = verifiedToken; // Attach user info to request object

      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;