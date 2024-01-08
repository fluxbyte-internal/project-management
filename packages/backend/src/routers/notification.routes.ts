import express from "express";
import * as NotificationController from "../controllers/notification.controller.js";

let router = express.Router();

router.get("/", NotificationController.getAllNotification);
router.put("/:notificationId", NotificationController.readNotification);

export default router;
