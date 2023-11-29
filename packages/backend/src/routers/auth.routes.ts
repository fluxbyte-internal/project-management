import express from 'express';
import * as AuthController from '../controllers/auth.controller.js';

let router = express.Router();

router.post('/sign-up', AuthController.signUp);
router.post('/login', AuthController.login);
router.get('/access-token', AuthController.getAccessToken);
router.post("/verify-email", AuthController.otpVerify);
router.post("/resend-otp", AuthController.resendOTP);

export default router;