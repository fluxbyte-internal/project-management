import express from 'express';
import * as UserController from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

let router = express.Router();

router.get('/me', authMiddleware, UserController.me);

export default router;