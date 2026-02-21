import { Router } from "express";
import { createOrder } from "../../controllers/razorpay.controller";
import { isAuthenticatedProvider } from "../../middlewares/providerAuth";
export const router = Router();

router.post(
  "/createOrder",
  isAuthenticatedProvider,
  createOrder
);
