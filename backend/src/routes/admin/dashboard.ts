import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import { getAllDashboardData } from "../../controllers/admin/dashboard.controller";


export const router = Router();

router
    .route("/")
    .get(isAuthenticatedUser, getAllDashboardData)

