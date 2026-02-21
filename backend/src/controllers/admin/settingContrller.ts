import { RequestHandler } from "express";
import { error, success } from "../../Handlers/index";
import { Setting } from "../../models/admin/settings.modal";

export const getSetting: RequestHandler = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const settings = await Setting.findOne({});

    if (settings) {
      success(res, {
        status: true,
        msg: "Setting retrieved successfully",
        data: [settings],
      });
    } else {
      error(res, {
        status: false,
        msg: "Failed to retrieve settings",
        error: [],
        statuscode: 500,
      });
    }
  } catch (err) {
    error(res, {
      status: false,
      msg: "Failed to retrieve settings",
      error: [],
      statuscode: 500,
    });
  }
};

export const updateSetting: RequestHandler = async (req, res, next): Promise<any> => {
  try {
    const {
      privacyPolicy,
      whatsapp,
      Website,
      facebook,
      twitter,
      instagram,
      customerServices,
      advanceAmountPercentage
    } = req.body;
    const { id } = req.params;

    let isSetting = await Setting.findOne({
      where: { id: Number(id) },
    });

    let updateData: any = {};
    if (privacyPolicy) updateData.privacyPolicy = privacyPolicy;
    if (whatsapp) updateData.whatsapp = whatsapp;
    if (Website) updateData.Website = Website;
    if (facebook) updateData.facebook = facebook;
    if (twitter) updateData.twitter = twitter;
    if (instagram) updateData.instagram = instagram;
    if (customerServices) updateData.customerServices = customerServices;
    if (advanceAmountPercentage) updateData.advanceAmountPercentage = advanceAmountPercentage;

    if (isSetting) {
      await Setting.update(updateData, {
        where: { id: id },
      });

      let updatedSetting = await Setting.findOne({
        where: { id: isSetting.id },
      });

      success(res, {
        status: true,
        msg: "Setting updated Successfully",
        data: [updatedSetting],
      });
    } else {
      let setting = await Setting.create(updateData);
      return success(res, {
        status: true,
        msg: "Setting created Successfully",
        data: [setting],
      });
    }
  } catch (error) {
    next(error);
  }
};
