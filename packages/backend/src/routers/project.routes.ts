import express from "express";
import * as ProjectController from "../controllers/project.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { UserRoleEnum } from "@prisma/client";

let router = express.Router();

router.get(
  "/",
  roleMiddleware([
    UserRoleEnum.ADMINISTRATOR,
    UserRoleEnum.PROJECT_MANAGER,
    UserRoleEnum.TEAM_MEMBER,
  ]),
  ProjectController.getProjects
);

router.get(
  "/:projectId",
  roleMiddleware([
    UserRoleEnum.ADMINISTRATOR,
    UserRoleEnum.PROJECT_MANAGER,
    UserRoleEnum.TEAM_MEMBER,
  ]),
  ProjectController.getProjectById
);

router.post(
  "/",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR, UserRoleEnum.PROJECT_MANAGER]),
  ProjectController.createProject
);

router.delete(
  "/:projectId",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR]),
  ProjectController.deleteProject
);

router.put(
  "/status/:projectId",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR, UserRoleEnum.PROJECT_MANAGER]),
  ProjectController.statusChangeProject
);

router.put(
  "/:projectId",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR, UserRoleEnum.PROJECT_MANAGER]),
  ProjectController.updateProject
);

export default router;
