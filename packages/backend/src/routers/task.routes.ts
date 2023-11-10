import express from 'express';
import * as TaskController from '../controllers/task.controller.js';

let router = express.Router();

router.get('/:projectId', TaskController.getTasks);
router.get('/byId/:taskId', TaskController.getTaskById);
router.post('/:projectId', TaskController.createTask);
router.delete('/:taskId', TaskController.deleteTask);

export default router;