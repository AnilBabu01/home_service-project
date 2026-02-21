import { Router } from "express";
import {
  createFaq,
  updateFaq,
  getAllFaq,
  deleteFaq,
  toggleBlock,
} from "../../controllers/admin/faq.Controller";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import {
  AddFaqValidation,
  UpdateFaqValidation
} from "../../middlewares/Validate";

export const router = Router();

router
  .route("/:id?")
  .get(isAuthenticatedUser, getAllFaq)
  .post(AddFaqValidation, isAuthenticatedUser, createFaq)
  .put(UpdateFaqValidation, isAuthenticatedUser, updateFaq)
  .delete(isAuthenticatedUser, deleteFaq);

router
  .route("/faq-block/:id?")
  .get(isAuthenticatedUser, toggleBlock);

