import express from 'express';
import * as ProjectController from '../controllers/project.controller.js';

let router = express.Router();

router.get('/', ProjectController.getProjects);
router.get('/:projectId', ProjectController.getProjectById);
router.post('/', ProjectController.createProject);
router.delete('/:projectId', ProjectController.deleteProject);
router.put('/:projectId', ProjectController.updateProject);
router.put('/status/:projectId', ProjectController.statusChangeProject);

export default router;