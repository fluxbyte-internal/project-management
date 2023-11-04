import express from 'express';
import * as AuthController from '../controllers/auth.controller.js';

let router = express.Router();

router.post('/sign-up', AuthController.signUp);
router.post('/login', AuthController.login);
router.put('/generate-token', AuthController.generateTokenFromRefreshToken);

export default router;