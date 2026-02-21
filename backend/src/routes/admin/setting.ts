import { Router } from "express";
import {
  getSetting,
  updateSetting,
} from "../../controllers/admin/settingContrller";
import { isAuthenticatedUser } from "../../middlewares/adminAuth";
import { SettingValidation } from "../../middlewares/Validate";

export const router = Router();

router
  .route("/:id?")
  .get(isAuthenticatedUser, getSetting)
  .put(SettingValidation, isAuthenticatedUser, updateSetting);
