import express from 'express';
import * as AuthController from '../controllers/auth.controller.js';

let router = express.Router();

router.post('/sign-up', AuthController.signUp);
router.post('/login', AuthController.login);
router.get('/access-token', AuthController.getAccessToken);
router.post("/root-auth", AuthController.verifyRoot);  
router.put("/reset-password/:token", AuthController.resetPassword);  
router.post("/forgot-password", AuthController.forgotPassword);  

export default router;