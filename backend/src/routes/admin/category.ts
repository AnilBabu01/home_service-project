import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  toggleBlock,
  deleteCategory,
} from "../../controllers/admin/masters.Controller";
import upload from "../../utils/upload";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import {
  AddCetegoryValidation,
  UpdateCetegoryValidation
} from "../../middlewares/Validate";

export const router = Router();

router
  .route("/:id?")
  .get(isAuthenticatedUser, getAllCategories)
  .post(upload.single("icon"),AddCetegoryValidation, isAuthenticatedUser, createCategory)
  .put(upload.single("icon"),UpdateCetegoryValidation, isAuthenticatedUser, updateCategory)
  .delete(isAuthenticatedUser, deleteCategory);


  router
  .route("/category-block/:id?")
  .get(isAuthenticatedUser, toggleBlock)
 
  