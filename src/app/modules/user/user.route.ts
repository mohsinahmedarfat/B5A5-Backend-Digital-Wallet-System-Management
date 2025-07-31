import { Router } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createZodSchema } from "./user.validation";

const router = Router();
router.post(
  "/register",
  validateRequest(createZodSchema),
  UserControllers.createUser
);
router.get("/all-users", UserControllers.getUsers);

export const UserRoutes = router;
