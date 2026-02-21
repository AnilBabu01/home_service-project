import { Router } from "express";
import {
  registerUser,
  loginUser,
  getprofile,
  updateprofile,
  saveNotificationToken,
  updateProfile,
} from "../../controllers/admin/auth.Controller";
import upload from "../../utils/upload";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import {
  LoginAdminValidation,
  RegisterAdminValidation,
} from "../../middlewares/Validate";
export const router = Router();

router.post("/signup", RegisterAdminValidation, registerUser);
router.post("/signin", LoginAdminValidation, loginUser);

router
  .route("/profile")
  .get(isAuthenticatedUser, getprofile)
  .post(upload.single("adminprofile"), isAuthenticatedUser, updateprofile);
router
  .route("/")
  .put(isAuthenticatedUser, updateProfile);
router
  .route("/saveNotificationToken")
  .post(isAuthenticatedUser, saveNotificationToken);
