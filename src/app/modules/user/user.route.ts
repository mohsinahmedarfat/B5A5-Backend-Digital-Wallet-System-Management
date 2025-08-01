import { Router } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createZodSchema, updateZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import checkAuth from "../../middlewares/checkAuth";

const router = Router();
router.post(
  "/register",
  validateRequest(createZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getUsers
);

// /api/v1/user/:id
router.patch(
  "/:id",
  validateRequest(updateZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

export const UserRoutes = router;
