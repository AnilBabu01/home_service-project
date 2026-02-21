import { RequestHandler } from "express";
import { Provider } from "../../models/admin/provider.modal";
import { Service } from "../../models/admin/services.nodal";
import { ServiceBooking } from "../../models/admin/servicebooking.modal";
import { User } from "../../models/user/user.model";
import { ProviderNumbering } from "../../models/admin/providenumbering.modal";
import { ProviderTimeSlot } from "../../models/admin/providertimeslot.modal";
import { Notification } from "../../models/admin/notification.modal";
import { Category } from "../../models/admin/category.modal";

import jwt from "jsonwebtoken";
import { hash, genSalt, compare } from "bcryptjs";
import { error, success } from "../../Handlers/index";

export const updateServices: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { name, description, address, hoursPrice } = req.body;
    const profileImage = req.file ? req.file.path : null;

    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        status: false,
        msg: "Only image files are allowed!",
      });
    }

    let updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (hoursPrice) updateData.hoursPrice = hoursPrice;
    if (address) updateData.address = address;

    if (profileImage) updateData.image = profileImage;

    let user = await Service.findOne({
      where: { provider_id: req.provider?.id },
    });

    if (user) {
      await Service.update(updateData, {
        where: { provider_id: req?.provider?.id },
      });

      user = await Service.findOne({
        where: { provider_id: req?.provider?.id },
      });

      return success(res, {
        status: true,
        msg: "Your service update successfully",
        data: [user],
      });
    }

    return error(res, {
      status: false,
      msg: "User not found",
      error: [],
      statuscode: 500,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePlan: RequestHandler = async (req: any, res: any, next) => {
  try {
    const { numberingKeys } = req.body;

    let isProvider = await Provider.findOne({
      where: { id: Number(req?.provider?.id) },
    });

    if (!isProvider) {
      return res.status(404).json({ status: false, msg: "Provider not found" });
    }

    console.log("ddd", req.body);

    if (
      !numberingKeys ||
      (typeof numberingKeys === "string" && numberingKeys.trim() === "empty")
    ) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid numberingKeys" });
    }

    try {
      const parsedKeys = JSON.parse(numberingKeys);

      // Extract only the IDs from numberingKeys
      const newIds = parsedKeys.map((item: any) => item.id);

      // Fetch existing records for this provider
      const existingRecords = await ProviderNumbering.findAll({
        where: { provider_id: isProvider.id },
      });

      // Delete extra records not present in numberingKeys
      for (const record of existingRecords) {
        if (!newIds.includes(record.id)) {
          await record.destroy();
        }
      }

      // Iterate through numberingKeys and update/create records
      for (const item of parsedKeys) {
        let existingNumbering = existingRecords.find(
          (rec) => rec.id === item.id
        );

        if (existingNumbering) {
          // Update existing record
          await existingNumbering.update({
            amount: item?.amount,
            onDiscount: item?.onDiscount,
          });
        } else {
          // Create new record
          await ProviderNumbering.create({
            keyName: item.keyName,
            amount: item?.amount,
            onDiscount: item?.onDiscount,
            provider_id: isProvider.id,
          });
        }
      }

      // Fetch updated records
      const updatedRecords = await ProviderNumbering.findAll({
        where: { provider_id: isProvider.id },
      });

      res.status(200).json({
        status: true,
        msg: "Plan list updated successfully",
        records: updatedRecords,
      });
    } catch (parseError) {
      return res.status(400).json({
        status: false,
        msg: "Invalid numberingKeys format",
        error: parseError,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateTimeSlot: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { numberingKeys } = req.body;

    let isProvider = await Provider.findOne({
      where: { id: Number(req?.provider?.id) },
    });

    if (!isProvider) {
      return res.status(404).json({ status: false, msg: "Provider not found" });
    }

    console.log("ddd", req.body);

    if (
      !numberingKeys ||
      (typeof numberingKeys === "string" && numberingKeys.trim() === "empty")
    ) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid numberingKeys" });
    }

    try {
      const parsedKeys = JSON.parse(numberingKeys);

      // Extract only the IDs from numberingKeys
      const newIds = parsedKeys.map((item: any) => item.id);

      // Fetch existing records for this provider
      const existingRecords = await ProviderTimeSlot.findAll({
        where: { provider_id: isProvider.id },
      });

      // Delete extra records not present in numberingKeys
      for (const record of existingRecords) {
        if (!newIds.includes(record.id)) {
          await record.destroy();
        }
      }

      // Iterate through numberingKeys and update/create records
      for (const item of parsedKeys) {
        let existingNumbering = existingRecords.find(
          (rec) => rec.id === item.id
        );

        if (existingNumbering) {
          // Update existing record

          await existingNumbering.update({
            slot: item?.slot,
            provider_id: item?.provider_id,
          });
        } else {
          // Create new record
          await ProviderTimeSlot.create({
            slot: item.slot,
            provider_id: isProvider.id,
            isAvailable: true,
          });
        }
      }

      // Fetch updated records
      const updatedRecords = await ProviderTimeSlot.findAll({
        where: { provider_id: isProvider.id },
      });

      res.status(200).json({
        status: true,
        msg: "Time slot list updated successfully",
        records: updatedRecords,
      });
    } catch (parseError) {
      return res.status(400).json({
        status: false,
        msg: "Invalid numberingKeys format",
        error: parseError,
      });
    }
  } catch (error) {
    next(error);
  }
};
