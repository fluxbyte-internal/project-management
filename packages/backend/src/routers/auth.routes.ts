import express from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

let router = express.Router();

router.post('/sign-up', AuthController.signUp);
router.post('/login', AuthController.login);
router.get('/access-token', AuthController.getAccessToken);
router.post("/verify-email", authMiddleware, AuthController.otpVerify);
router.post("/resend-otp", authMiddleware, AuthController.resendOTP);
router.post("/root-auth", AuthController.verifyRoot);  
router.post("/reset-password/:token", AuthController.resetPassword);  
router.post("/forgot-password", AuthController.forgotPassword);  

export default router;