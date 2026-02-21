import { Router } from "express";
import { router as authRouter } from "./auth";
import { router as categoryRouter } from "./category";
import { router as faqRouter } from "./faq";
import { router as faqcategoryRouter } from "./faqcategory";
import { router as notificationRouter } from "./notification";
import { router as providerRouter } from "./provider";
import { router as serviceRouter } from "./service";
import { router as settingRouter } from "./setting";
import { router as userRouter } from "./user.route";
import { router as dashboardRouter } from "./dashboard";
import { router as bookingRouter } from "./booking";
import { router as sliderRouter } from "./slider.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/faq", faqRouter);
router.use("/faqcategory", faqcategoryRouter);
router.use("/notification", notificationRouter);
router.use("/provider", providerRouter);
router.use("/service", serviceRouter);
router.use("/setting", settingRouter);
router.use("/users", userRouter);
router.use("/dashboard", dashboardRouter);
router.use("/bookings", bookingRouter);
router.use("/sliders", sliderRouter);

export default router;

