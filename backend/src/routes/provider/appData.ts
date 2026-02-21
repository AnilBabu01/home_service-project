import { Router } from "express";
import { getAllNotificationProviderApp, updateNotificationSeenStatus } from "../../controllers/admin/notification.Controller";
import { isAuthenticatedProvider } from "../../middlewares/providerAuth";
import {
  addBooking,
  cancelBooking,
  completeBooking,
  getAllProviderBookingApp,
} from "../../controllers/admin/booking.Controller";
import {
  updateServices,
  updatePlan,
  updateTimeSlot,
} from "../../controllers/provider/app.Controller";
import upload from "../../utils/upload";
import { getTimeSlots } from "../../controllers/admin/provider.Controller";
import { activeSliders, index } from "../../controllers/admin/slider.controller";
export const router = Router();

router.get(
  "/notification",
  isAuthenticatedProvider,
  getAllNotificationProviderApp
);

router.put(
  "/notification",
  isAuthenticatedProvider,
  updateNotificationSeenStatus
);

router
  .route("/booking/:type?")
  .get(isAuthenticatedProvider, getAllProviderBookingApp)
  .post(isAuthenticatedProvider, addBooking);
router.get("/getTimeSlotByProviderId/:providerId", isAuthenticatedProvider, getTimeSlots);
router
  .route("/update-service")
  .put(upload.single("profile"), isAuthenticatedProvider, updateServices);

router.route("/update-plan").put(isAuthenticatedProvider, updatePlan);

router.route("/update-timeslot").put(isAuthenticatedProvider, updateTimeSlot);
router.route("/sliders").get(isAuthenticatedProvider, activeSliders);

router
  .route("/booking/cancel/:serviceBookingId")
  .delete(isAuthenticatedProvider, cancelBooking);

router
  .route("/booking/complete/:serviceBookingId")
  .put(isAuthenticatedProvider, completeBooking);
