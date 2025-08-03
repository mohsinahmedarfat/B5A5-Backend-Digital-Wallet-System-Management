import { Router } from "express";
import { WalletController } from "./wallet.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WalletController.getWallets
);

router.patch(
  "/top-up/:userId",
  checkAuth(...Object.values(Role)),
  WalletController.topUpWallet
);

router.patch(
  "/withdraw/:userId",
  checkAuth(...Object.values(Role)),
  WalletController.withdrawWallet
);

router.patch(
  "/send/:receiverId",
  checkAuth(...Object.values(Role)),
  WalletController.sendWallet
);

router.patch(
  "/status/:userId",
  checkAuth(...Object.values(Role)),
  WalletController.statusWallet
);

export const WalletRoutes = router;
