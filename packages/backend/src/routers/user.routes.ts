import express from 'express';
import * as UserController from '../controllers/user.controller.js';
import fileUpload from 'express-fileupload';

let router = express.Router();

router.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

router.get("/me", UserController.me);
router.put("/", UserController.updateUserProfile);
router.put("/avatarImg-update", UserController.updateUserAvtarImg);
router.put("/organisation/:userOrganisationId",UserController.updateUserOrganisationSettings);
router.post("/verify-email", UserController.otpVerify);
router.post("/resend-otp", UserController.resendOTP);
export default router;
