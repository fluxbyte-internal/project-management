import express from "express";
import * as AuthController from "../controllers/auth.controller.js";
import passport from "passport";
import { settings } from "../config/settings.js";

let router = express.Router();

  
router.put("/reset-password/:token", AuthController.resetPassword);  
router.post("/forgot-password", AuthController.forgotPassword);  
router.post("/sign-up", AuthController.signUp);
router.post("/login", AuthController.login);
router.get("/access-token", AuthController.getAccessToken);
router.post("/root-auth", AuthController.verifyRoot);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${settings.appURL}/signup`,
    session: false,
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: settings.appURL,
    failureRedirect: `${settings.appURL}/signup`,
  })
);

export default router;
