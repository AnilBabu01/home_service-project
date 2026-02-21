import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import { getAllBookingForAdmin } from "../../controllers/admin/booking.Controller";


export const router = Router();

router
    .route("/")
    .get(isAuthenticatedUser, getAllBookingForAdmin)

