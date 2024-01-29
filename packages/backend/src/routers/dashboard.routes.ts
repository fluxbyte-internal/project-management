import express from "express";
import * as DashboardController from "../controllers/dashboard.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { UserRoleEnum } from "@prisma/client";

let router = express.Router();

router.get(
  "/projectManagerProjects",
  roleMiddleware([UserRoleEnum.PROJECT_MANAGER]),
  DashboardController.projectManagerProjects
);

router.get(
  "/administartorProjects",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR]),
  DashboardController.administartorProjects
);

router.get(
  "/allOrganisationsProjects",
  DashboardController.allOrganisationsProjects
);

router.get(
  "/dashboardByProjectId/:projectId",
  DashboardController.projectDashboardByprojectId
);

export default router;
