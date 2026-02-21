import { Router } from "express";
import { createOrder } from "../../controllers/razorpay.controller";
import { isAuthenticatedUser } from "../../middlewares/userAuth";
export const router = Router();

router.post(
  "/createOrder",
  isAuthenticatedUser,
  createOrder
);
