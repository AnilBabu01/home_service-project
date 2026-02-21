import { Router } from "express";
import {
  createFaqCategory,
  updateFaqCategory,
  deleteFaqCategory,
  getAllFaqCategory,
  toggleBlock,
  getAllFaqCategoryApp
} from "../../controllers/admin/faqCategory.Controller";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import {
  AddFaqCategoryValidation,
  UpdateFaqCategoryValidation,
} from "../../middlewares/Validate";

export const router = Router();

router
  .route("/:id?")
  .get(isAuthenticatedUser, getAllFaqCategory)
  .post(AddFaqCategoryValidation, isAuthenticatedUser, createFaqCategory)
  .put(UpdateFaqCategoryValidation, isAuthenticatedUser, updateFaqCategory)
  .delete(isAuthenticatedUser, deleteFaqCategory);

router
  .route("/faqcategory-block/:id?")
  .get(isAuthenticatedUser, toggleBlock);

  router
  .route("/allfaqcategory")
  .get(isAuthenticatedUser, getAllFaqCategoryApp);