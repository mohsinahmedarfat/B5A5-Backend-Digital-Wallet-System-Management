import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.getTransactions
);

router.get("/me", checkAuth(...Object.values(Role)), TransactionController.getTransactionMe);
export const TransactionRoutes = router;
