import express from 'express';
import * as ProjectController from '../controllers/project.controller.js';

let router = express.Router();

router.get('/', ProjectController.getProjects);
router.get('/:projectId', ProjectController.getProjectById);
router.post('/', ProjectController.createProject);
router.delete('/:projectId', ProjectController.deleteProject);
router.put('/status/:projectId', ProjectController.statusChangeProject);
router.put('/:projectId', ProjectController.updateProject);

router.get('/kanban-column/:projectId', ProjectController.getKanbanColumnById);
router.post('/kanban-column/:projectId', ProjectController.createKanbanColumn);
router.put('/kanban-column/:kanbanColumnId', ProjectController.updatekanbanColumn);
router.delete('/kanban-column/:kanbanColumnId', ProjectController.deleteKanbanColumn);


export default router;