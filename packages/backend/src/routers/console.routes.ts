import express from "express";
import * as ConsoleController from "../controllers/console.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

let router = express.Router();

router.post("/super-admin", ConsoleController.createSuperAdmin);
router.post("/login", ConsoleController.loginConsole);
router.get("/me", authMiddleware, ConsoleController.me);
router.post("/operator", authMiddleware, ConsoleController.createOperator);
router.delete(
  "/operator/:userId",
  authMiddleware,
  ConsoleController.deleteOperator
);
router.put(
  "/operator/status/:userId",
  authMiddleware,
  ConsoleController.changeOperatorStatus
);
router.put(
  "/user/status/:userId",
  authMiddleware,
  ConsoleController.changeUserStatus
);

router.put(
  "/user/role/:organisationId",
  authMiddleware,
  ConsoleController.changeUserOrganisationRole
);

router.put(
  "/organisation/status/:organisationId",
  authMiddleware,
  ConsoleController.changeOrganisationStatus
);

router.put(
  "/organisations/block-reassigned",
  authMiddleware,
  ConsoleController.blockAndReassignAdministator
);

router.put(
  "/organisations/administrator-change/",
  authMiddleware,
  ConsoleController.changeOrgAdministator
);

router.get(
  "/organisations",
  authMiddleware,
  ConsoleController.getAllOrganisation
);

router.get(
  "/organisations/:organisationId",
  authMiddleware,
  ConsoleController.organisationsUser
);

router.delete(
  "/organisations/:organisationId",
  authMiddleware,
  ConsoleController.deleteOrganisation
);

router.get("/operator", authMiddleware, ConsoleController.getAllOperator);
router.put("/operator", authMiddleware, ConsoleController.updateOperator);
router.put(
  "/change-password",
  authMiddleware,
  ConsoleController.changePassword
);
router.put(
  "/profile",
  authMiddleware,
  ConsoleController.updateConsoleUserAvtarImg
);

router.put(
  "/verify-otp",
  authMiddleware,
  ConsoleController.otpVerifyConsole
);

router.post(
  "/resend-otp",
  authMiddleware,
  ConsoleController.resendOTP
);

export default router;
