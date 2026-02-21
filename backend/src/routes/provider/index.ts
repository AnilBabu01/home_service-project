import { Router } from "express";
import { router as appDatadataRouter } from "./appData";
import { router as authRouter } from "./auth";
import { router as razorpayRouter } from "./razorpay";

const router = Router();

router.use("/auth", authRouter);
router.use("/", appDatadataRouter);
router.use("/razorpay", razorpayRouter);

export default router;
