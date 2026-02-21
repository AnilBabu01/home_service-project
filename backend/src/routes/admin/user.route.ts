import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import { index, updateStatus, updateUser } from "../../controllers/admin/user.controller";

export const router = Router();

router
    .route("/")
    .get(isAuthenticatedUser, index);

router
    .route("/:userId")
    .put(isAuthenticatedUser, updateUser);

router
    .route("/updateStatus/:userId")
    .put(isAuthenticatedUser, updateStatus);
