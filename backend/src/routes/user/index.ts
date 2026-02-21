import { Router } from "express";
import { router as authRouter } from "./auth";
import { router as appDataRouter } from "./appData";
import { router as razorpayRouter } from "./razorpay";

const router = Router();

router.use("/auth", authRouter);

router.use("/", appDataRouter);
router.use("/razorpay", razorpayRouter);

export default router;
