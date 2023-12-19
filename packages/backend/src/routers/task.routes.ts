import express from 'express';
import * as TaskController from '../controllers/task.controller.js';

let router = express.Router();

router.get('/taskAssignUsers', TaskController.taskAssignToUser);

router.put('/status/completed/:projectId', TaskController.statusCompletedAllTAsk);
router.put('/status/:taskId', TaskController.statusChangeTask);

router.put('/comment/:commentId', TaskController.updateComment);
router.delete('/comment/:commentId', TaskController.deleteComment);
router.post('/comment/:taskId', TaskController.addComment);

router.post('/attachment/:taskId', TaskController.addAttachment);
router.delete('/attachment/:attachmentId', TaskController.deleteAttachment);

router.post('/member/:taskId', TaskController.addMemberToTask);
router.delete('/member/:taskAssignUsersId', TaskController.deleteMemberFromTask);

router.post('/dependencies/:taskId', TaskController.addOrRemoveDependencies);

router.get('/byId/:taskId', TaskController.getTaskById);
router.get('/:projectId', TaskController.getTasks);
router.put('/:taskId', TaskController.updateTask);
router.delete('/:taskId', TaskController.deleteTask);
router.post('/:projectId/:parentTaskId?', TaskController.createTask);

export default router;