import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

// const validateRequest = () => () => {}
const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the provided Zod schema
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
