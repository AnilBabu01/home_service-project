import { Router } from "express";
import {
  createService,
  updateService,
  getAllServices,
  deleteService,
  toggleBlock,
} from "../../controllers/admin/services.Controller";
import upload from "../../utils/upload";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import {
  AddServiceValidation,
  UpdateServiceValidation,
} from "../../middlewares/Validate";

export const router = Router();


router
  .route("/:id?")
  .get(isAuthenticatedUser, getAllServices)
  .post(
    upload.single("image"),
    AddServiceValidation,
    isAuthenticatedUser,
    createService
  )
  .put(
    upload.single("image"),
    UpdateServiceValidation,
    isAuthenticatedUser,
    updateService
  )
  .delete(isAuthenticatedUser, deleteService);

router
  .route("/service-block/:id?")
  .get(isAuthenticatedUser, toggleBlock);
