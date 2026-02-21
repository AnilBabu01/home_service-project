import { Router } from "express";
import { getAllCategoriesApp } from "../../controllers/admin/masters.Controller";
import {
  getAllServicesApp,
  getAllFavouriteServicesApp,
  addFavouriteServicesApp,
  addReviewServicesApp,
  addReviewLikeApp,
  getServiceByIdApp
} from "../../controllers/admin/services.Controller";
import { getAllFaqApp } from "../../controllers/admin/faq.Controller";
import { getAllFaqCategoryApp } from "../../controllers/admin/faqCategory.Controller";
import { getSetting } from "../../controllers/admin/settingContrller";
import { getAllNotificationApp, updateNotificationSeenStatus } from "../../controllers/admin/notification.Controller";
import { isAuthenticatedUser } from "../../middlewares/userAuth";
import {
  addBooking,
  cancelBooking,
  completeBooking,
  getAllBookingApp,

} from "../../controllers/admin/booking.Controller";
import { getTimeSlots } from "../../controllers/admin/provider.Controller";
import { activeSliders, index } from "../../controllers/admin/slider.controller";

export const router = Router();

router.get("/categories", isAuthenticatedUser, getAllCategoriesApp);

router.post("/services/:id?", isAuthenticatedUser, getAllServicesApp);

router.get("/getServiceByIdApp/:service_id?", isAuthenticatedUser, getServiceByIdApp);

router.post("/addfavourite", isAuthenticatedUser, addFavouriteServicesApp);

router.post("/addreview", isAuthenticatedUser, addReviewServicesApp);

router.post("/addreviewlike", isAuthenticatedUser, addReviewLikeApp);

router.post("/favourite", isAuthenticatedUser, getAllFavouriteServicesApp);

router.post("/faq", isAuthenticatedUser, getAllFaqApp);

router.get("/faqcategory", isAuthenticatedUser, getAllFaqCategoryApp);

router.get("/setting", getSetting);
router.route("/sliders").get(isAuthenticatedUser, activeSliders);

router.get("/notification", isAuthenticatedUser, getAllNotificationApp);
router.put(
  "/notification",
  isAuthenticatedUser,
  updateNotificationSeenStatus
);
router.get("/getTimeSlotByProviderId/:providerId", isAuthenticatedUser, getTimeSlots);

router
  .route("/booking/:type?")
  .get(isAuthenticatedUser, getAllBookingApp)
  .post(isAuthenticatedUser, addBooking);

router
  .route("/booking/cancel/:serviceBookingId")
  .delete(isAuthenticatedUser, cancelBooking);

router
  .route("/booking/complete/:serviceBookingId")
  .put(isAuthenticatedUser, completeBooking);
