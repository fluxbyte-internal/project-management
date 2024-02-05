import express from "express";
import * as OrganisationControlller from "../controllers/organisation.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { UserRoleEnum } from "@prisma/client";

let router = express.Router();

router.get("/:organisationId", OrganisationControlller.getOrganisationById);

router.put(
  "/re-assigned-task/",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR]),
  OrganisationControlller.reassignTasks
);

router.post("/", OrganisationControlller.createOrganisation);

router.post(
  "/:organisationId/user",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR]),
  OrganisationControlller.addOrganisationMember
);

router.put(
  "/:userOrganisationId",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR]),
  OrganisationControlller.changeMemberRole
);

router.delete(
  "/:userOrganisationId",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR]),
  OrganisationControlller.removeOrganisationMember
);

router.put(
  "/:organisationId",
  roleMiddleware([UserRoleEnum.ADMINISTRATOR]),
  OrganisationControlller.updateOrganisation
);

export default router;
