import { Router } from "express";
import {
  loginUser,
  getprofile,
  updateProfile,
} from "../../controllers/provider/auth.controller";
import upload from "../../utils/upload";
import { isAuthenticatedProvider } from "../../middlewares/providerAuth";
import { LoginValidation } from "../../middlewares/Validate";

export const router = Router();

router.post("/signin", LoginValidation, loginUser);

router
  .route("/profile")
  .get(isAuthenticatedProvider, getprofile)
  .put(upload.single("profile"), isAuthenticatedProvider, updateProfile);

  