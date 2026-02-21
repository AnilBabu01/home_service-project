import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import { addSlider, deleteSlider, index, updateSlider, updateSliderStatus } from "../../controllers/admin/slider.controller";
import upload from "../../utils/upload";

export const router = Router();

router
    .route("/")
    .get(isAuthenticatedUser, index);
router
    .route("/")
    .post(upload.single("image"), isAuthenticatedUser, addSlider);

router
    .route("/:id")
    .put(upload.single("image"), isAuthenticatedUser, updateSlider);

router
    .route("/updateStatus/:id")
    .put(isAuthenticatedUser, updateSliderStatus);

router
    .route("/:id")
    .delete(isAuthenticatedUser, deleteSlider);