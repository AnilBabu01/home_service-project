import { Router } from "express";
import {
  registerUser,
  loginUser,
  getprofile,
  completeProfile,
  changePassword,
} from "../../controllers/user/auth.Controller";
import upload from "../../utils/upload";
import { isAuthenticatedUser } from "../../middlewares/userAuth";
import {
  LoginValidation,
  RegisterValidation,
  ProfileValidation
} from "../../middlewares/Validate";

export const router = Router();

router.post("/signup", RegisterValidation, registerUser);
router.post("/signin", LoginValidation, loginUser);
router.post("/changePassword", isAuthenticatedUser, changePassword);
router
  .route("/profile")
  .get(isAuthenticatedUser, getprofile)
  .put(upload.single("profile"), ProfileValidation, isAuthenticatedUser, completeProfile);


