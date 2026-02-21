import { RequestHandler } from "express";
import { error, success } from "../../Handlers/index";
import { Notification } from "../../models/admin/notification.modal";
import { Op } from "sequelize";
import { sendNotificationToTopic } from "../../utils/sendNotificationToTopic ";
import { sendNotificationToToken } from "../../utils/webNotification";

export const sendWebNotification: RequestHandler = async (req, res, next) => {
  try {
    const { message, title } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    let fcmToken =
      "cIfmFsKtIaXLMYBhQCBYo1:APA91bH4S2NEqLp7d_wXDiN596LlqqO8EMemyhgWrPK96t2OxDaUkfDmkaKhThowiZLKQ5yr2EDqpo5FYjFzGqmgmaAbRQCnJ72fP3INIzW2kba1mn2Quh8";

    let notificationToToken = await sendNotificationToToken(
      message,
      title,
      imageUrl || "",
      fcmToken,
      {}
    );

    success(res, {
      status: true,
      msg: "Web notification sent successfully",
      data: [notificationToToken],
    });
  } catch (err) {
    next(err);
  }
};

export const createNotification: RequestHandler = async (req, res, next) => {
  try {
    const { message, type, title } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newNotification = await Notification.create({
      message,
      title,
      type,
    });

    let topic = "";
    let notificationRes;
    if (type === "user") {
      topic = "user_topic";
    }

    if (type === "provider") {
      topic = "provider_topic";
    }

    if (type === "all") {
      notificationRes = await sendNotificationToTopic(
        message,
        title,
        imageUrl || "",
        "user_topic"
      );

      notificationRes = await sendNotificationToTopic(
        message,
        title,
        imageUrl || "",
        "provider_topic"
      );
    } else {
      notificationRes = await sendNotificationToTopic(
        message,
        title,
        imageUrl || "",
        topic
      );
    }

    success(res, {
      status: true,
      msg: "Notification sent successfully",
      data: [notificationRes],
    });
  } catch (err) {
    next(err);
  }
};

export const getAllNotification: RequestHandler = async (req, res, next) => {
  try {
    const { page = 1, limit = 2 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset,
    };

    const { count, rows } = await Notification.findAndCountAll(queryOptions);

    res.json({
      status: true,
      msg: "Notification retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotificationApp: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const userId = req.user?.id;

    console.log("User ID:", userId);

    const type = "user";
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
      where: {
        [Op.or]: [
          userId ? { user_id: userId } : null,
          type ? { type } : null,
        ].filter(Boolean),
      },
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset,
    };

    const { count, rows } = await Notification.findAndCountAll(queryOptions);
    let unseenCount = await Notification.count({
      where: {
        user_id: userId,
        seen: false
      }
    });

    res.json({
      status: true,
      msg: "Notification retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
        unseenCount
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotificationProviderApp: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const userId = req.provider?.userId;

    console.log("User ID:", userId);

    const type = "provider";
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
      where: {
        [Op.or]: [
          userId ? { user_id: userId } : null,
          type ? { type } : null,
        ].filter(Boolean),
      },
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset,
    };

    const { count, rows } = await Notification.findAndCountAll(queryOptions);

    let unseenCount = await Notification.count({
      where: {
        user_id: userId,
        seen: false
      }
    })

    res.json({
      status: true,
      msg: "Notification retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
        unseenCount
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotificationSeenStatus: RequestHandler = async (req: any, res: any, next): Promise<any> => {
  try {
    const userId = req.provider?.userId ?? req.user.id;
    await Notification.update({ seen: true }, { where: { user_id: userId } });
    return success(res, {
      msg: "Notification seen status updated successfully",
    })
  } catch (error) {
    next(error);
  }
}
