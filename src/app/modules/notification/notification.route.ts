import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { NotificationController } from "./notification.controller";

const router = Router();
router.get(
  "/",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  NotificationController.getNotifications
);

router.get("/me", checkAuth(...Object.values(Role)), NotificationController.getNotificationMe);

export const NotificationRoutes = router;