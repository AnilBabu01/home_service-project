import { Router } from "express";
import {
  getAllProviderList,
  updateProvider,
  updateProviderPassword,
} from "../../controllers/admin/provider.Controller";
import upload from "../../utils/upload";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";

export const router = Router();

router
  .route("/:id?")
  .get(isAuthenticatedUser, getAllProviderList)
  .put(upload.single("image"), isAuthenticatedUser, updateProvider);

  router.put("/updatePassword/:id", isAuthenticatedUser, updateProviderPassword);
