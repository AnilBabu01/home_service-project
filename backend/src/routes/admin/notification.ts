import { Router } from "express";
import {
  createNotification,
  getAllNotification,
  sendWebNotification,
} from "../../controllers/admin/notification.Controller";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import { SendNotificationValidation } from "../../middlewares/Validate";
import upload from "../../utils/upload";

export const router = Router();

router
  .route("/senAppNotification/:id?")
  .get(isAuthenticatedUser, getAllNotification)
  .post(upload.single("image"), isAuthenticatedUser, createNotification);

router
  .route("/senWebNotification")
  .post(upload.single("image"), isAuthenticatedUser, sendWebNotification);
