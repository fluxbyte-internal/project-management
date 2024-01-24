import express from "express";
import * as TaskController from "../controllers/task.controller.js";
import { UserRoleEnum } from "@prisma/client";
import { roleMiddleware } from "../middleware/role.middleware.js";

let router = express.Router();

router.get(
  "/taskAssignUsers",
  roleMiddleware([
    UserRoleEnum.ADMINISTRATOR,
    UserRoleEnum.PROJECT_MANAGER,
    UserRoleEnum.TEAM_MEMBER,
  ]),
  TaskController.taskAssignToUser
);

router.put(
  "/status/completed/:projectId",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR, UserRoleEnum.PROJECT_MANAGER]),
  TaskController.statusCompletedAllTAsk
);

router.put("/status/:taskId", TaskController.statusChangeTask);

router.put("/comment/:commentId", TaskController.updateComment);

router.delete("/comment/:commentId", TaskController.deleteComment);

router.post("/comment/:taskId", TaskController.addComment);

router.post("/attachment/:taskId", TaskController.addAttachment);

router.delete("/attachment/:attachmentId", TaskController.deleteAttachment);

router.post("/member/:taskId", TaskController.addMemberToTask);

router.delete(
  "/member/:taskAssignUsersId",
  TaskController.deleteMemberFromTask
);

router.post("/dependencies/:taskId", TaskController.addDependencies);

router.delete(
  "/dependencies/:taskDependenciesId",
  TaskController.removeDependencies
);

router.post("/milestone/:taskId", TaskController.addOrRemoveMilesstone);

router.get(
  "/byId/:taskId",
  roleMiddleware([
    UserRoleEnum.ADMINISTRATOR,
    UserRoleEnum.PROJECT_MANAGER,
    UserRoleEnum.TEAM_MEMBER,
  ]),
  TaskController.getTaskById
);

router.get(
  "/:projectId",
  roleMiddleware([
    UserRoleEnum.ADMINISTRATOR,
    UserRoleEnum.PROJECT_MANAGER,
    UserRoleEnum.TEAM_MEMBER,
  ]),
  TaskController.getTasks
);

router.put("/:taskId", TaskController.updateTask);

router.delete("/:taskId", TaskController.deleteTask);

router.post(
  "/:projectId/:parentTaskId?",
  roleMiddleware([
    UserRoleEnum.ADMINISTRATOR,
    UserRoleEnum.PROJECT_MANAGER,
    UserRoleEnum.TEAM_MEMBER,
  ]),
  TaskController.createTask
);

export default router;
