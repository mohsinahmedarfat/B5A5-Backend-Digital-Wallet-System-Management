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

router.get("/me", checkAuth(...Object.values(Role)), WalletController.getWalletMe);

router.patch(
  "/top-up/user/:userEmail",
  checkAuth(...Object.values(Role)),
  WalletController.topUpUserWallet
);

router.patch(
  "/top-up/agent/:agentEmail",
  checkAuth(...Object.values(Role)),
  WalletController.topUpAgentWallet
);

router.patch(
  "/withdraw/:agentEmail",
  checkAuth(...Object.values(Role)),
  WalletController.withdrawWallet
);

router.patch(
  "/send/:receiverEmail",
  checkAuth(...Object.values(Role)),
  WalletController.sendWallet
);

router.patch(
  "/status/:userId",
  checkAuth(...Object.values(Role)),
  WalletController.statusWallet
);

export const WalletRoutes = router;
