import e, { RequestHandler } from "express";
import { error, success } from "../../Handlers/index";
import { ServiceBooking } from "../../models/admin/servicebooking.modal";
import { Service } from "../../models/admin/services.nodal";
import { User } from "../../models/user/user.model";
import { Provider } from "../../models/admin/provider.modal";
import { ProviderNumbering } from "../../models/admin/providenumbering.modal";
import { ProviderTimeSlot } from "../../models/admin/providertimeslot.modal";
import { Notification } from "../../models/admin/notification.modal";
import { Category } from "../../models/admin/category.modal";
import { Room } from "../../models/user/room.modal";
import uuid4 from "uuid4";
import { RoomUser } from "../../models/user/roomUser.modal";
import { Review } from "../../models/admin/review.modal";
import { ServiceBookingNumbering } from "../../models/admin/serviceBookingNumbering.modal";
import { Transaction } from "../../models/admin/transaction.modal";
import { createOrder as createRazorpayOrder } from "../../services/razorpay";
import { sendNotificationToToken } from "../../utils/webNotification";

export const addBooking: RequestHandler = async (
  req: any,
  res: any,
  next
): Promise<any> => {
  try {
    const {
      service_id,
      slot_id,
      date,
      time,
      amount,
      tax,
      totalAmount,
      paymentMethod,
      address,
      contextual,
      time_slot_id,
      latitude,
      longitude,
      advanceAmount,
      providerNumberings,
    } = req.body;

    console.log("tiem sloe is", time_slot_id);

    let isTimeSlot = await ProviderTimeSlot.findByPk(Number(time_slot_id));

    if (!isTimeSlot) {
      return error(res, {
        status: false,
        msg: "Time slot not found",
        error: [],
        statuscode: 500,
      });
    }
    await ProviderTimeSlot.update(
      {
        isAvailable: false,
      },
      { where: { id: isTimeSlot?.id } }
    );

    const randomNumber = Math.floor(100000000000 + Math.random() * 9000000);

    const newBooking = await ServiceBooking.create({
      service_id: service_id,
      user_id: req.user?.id ? req.user?.id : req.provider.userId,
      date: date,
      time: time,
      time_slot_id: time_slot_id,
      amount: amount,
      address: address,
      status: 0,
      paymentMethod: paymentMethod,
      transactionId: randomNumber.toString(),
      tax: tax,
      totalAmount: totalAmount,
      latitude,
      longitude,
      advanceAmount: 0,
      // contextual: 'contextual',
    });

    if (newBooking) {
      let numberings =
        providerNumberings?.map((numbering: any) => {
          return {
            serviceBookingId: newBooking.id,
            providerNumberingId: numbering.providerNumberingId,
            count: numbering.count,
          };
        }) ?? [];
      await ServiceBookingNumbering.bulkCreate(numberings);
      let razorpayResponse = null;
      if (advanceAmount > 0) {
        const receiptId = `RC-${Date.now()}`;
        razorpayResponse = await createRazorpayOrder({ amount, receiptId });
        console.log(razorpayResponse);
        await Transaction.create({
          transactionId: receiptId,
          razorpayTransactionId: razorpayResponse.id,
          amount: amount,
          status: 0,
          userId: req.user?.id,
          serviceBookingId: newBooking.id,
        });
      }
      const newNotification = await Notification.create({
        message: `Your booking done`,
        title: "Booking",
        type: "booking",
        user_id: req.user?.id ? req.user?.id : req.provider.userId,
      });
      const roomId = uuid4();
      newBooking.roomId = roomId;
      await newBooking.save();
      let roomData = await Room.findOne({
        where: {
          userId: req.user?.id ? req.user?.id : req.provider.userId,
          providerId: isTimeSlot.provider_id,
        },
      });
      console.log(roomData);
      if (!roomData) {
        let room = await Room.create({
          userId: req.user?.id ? req.user?.id : req.provider.userId,
          providerId: isTimeSlot.provider_id,
          roomId,
        });
        let roomUsers = [
          {
            roomId: room.id,
            userId: req.user?.id ? req.user?.id : req.provider.userId,
          },
          {
            roomId: room.id,
            providerId: isTimeSlot.provider_id,
          },
        ];
        await RoomUser.bulkCreate(roomUsers);
      } else {
        await ServiceBooking.update(
          {
            roomId: roomData.roomId,
          },
          {
            where: {
              id: newBooking.id,
            },
          }
        );
        await RoomUser.update(
          {
            isChatPaused: 0,
          },
          {
            where: {
              id: roomData.id,
            },
          }
        );
      }
      if (newNotification) {
        const isBooking = await ServiceBooking.findOne({
          where: {
            id: newBooking?.id,
          },
          include: [
            {
              model: Service,
              as: "service",
              attributes: [
                "id",
                "name",
                "image",
                "description",
                "address",
                "hoursPrice",
              ],
              include: [
                {
                  model: Category,
                  as: "category",
                  attributes: ["id", "name", "icon", "bgColor", "block"],
                },
                {
                  model: Provider,
                  as: "provider",
                  attributes: [
                    "id",
                    "name",
                    "email",
                    "mobile_no",
                    "experience",
                    "profile",
                    "createdAt",
                    "latitude",
                    "longitude",
                  ],
                  include: [
                    {
                      model: ProviderNumbering,
                      as: "providerNumbering",
                      attributes: [
                        "id",
                        "keyName",
                        "amount",
                        "onDiscount",
                        "count",
                        "createdAt",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: User,
              as: "user",
              attributes: ["id"],
            },
          ],
        });

        return success(res, {
          status: true,
          msg: "Your Booking Successfully",
          data: [isBooking],
          extraData: razorpayResponse,
        });
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const cancelBooking: RequestHandler = async (
  req: any,
  res: any,
  next
): Promise<any> => {
  try {
    const { serviceBookingId } = req.params;
    let serviceBooking = await ServiceBooking.findOne({
      where: { id: serviceBookingId },
    });
    if (!serviceBooking) {
      return error(res, {
        msg: "Booking not found",
      });
    }
    let service = await Service.findOne({
      where: {
        id: serviceBooking.service_id,
      },
    });
    await ProviderTimeSlot.update(
      {
        isAvailable: true,
      },
      {
        where: {
          id: serviceBooking?.time_slot_id,
        },
      }
    );
    serviceBooking.status = 2;
    serviceBooking.reason = req.body.reason;
    serviceBooking.reasonDescription = req.body.reasonDescription;
    await serviceBooking?.save();
    
    const newNotification = await Notification.create({
      message: `Your booking cancelled`,
      title: "Booking",
      type: "cancelledBooking",
      user_id: req.provider ? req.provider.userId : req.user.id,
    });

    let serviceBookingData = await ServiceBooking.count({
      where: {
        service_id: serviceBooking.service_id,
        user_id: serviceBooking.user_id,
        status: 0,
      },
    });
    if (serviceBookingData == 0) {
      await Room.update(
        {
          isChatPaused: 1,
        },
        {
          where: {
            userId: serviceBooking?.user_id,
            providerId: service?.provider_id,
          },
        }
      );
    }

    // const currentUserId = req.provider ? req.provider.userId : req.user.id;
    // const oppositeUserId = serviceBooking.user_id != currentUserId ? serviceBooking.service.provider.userId : currentUserId;

    const oppositeUserId = serviceBooking.user_id;
    const user = await User.findOne({
      where: {
        id: oppositeUserId,
      },
    });
    if (user?.notification_token) {
      await sendNotificationToToken(
        "Booking",
        "Your booking cancelled",
        null,
        user.notification_token,
        {}
      );
    }

    return success(res, {
      status: true,
      msg: "Your Booking Successfully Cancelled",
      data: [],
    });
  } catch (err) {
    next(err);
  }
};

export const completeBooking: RequestHandler = async (
  req: any,
  res: any,
  next
): Promise<any> => {
  try {
    const { serviceBookingId } = req.params;
    let serviceBooking = await ServiceBooking.findOne({
      where: { id: serviceBookingId },
    });
    if (!serviceBooking) {
      return error(res, {
        msg: "Booking not found",
      });
    }
    let service = await Service.findOne({
      where: {
        id: serviceBooking.service_id,
      },
    });
    await ProviderTimeSlot.update(
      {
        isAvailable: true,
      },
      {
        where: {
          id: serviceBooking?.time_slot_id,
        },
      }
    );
    serviceBooking.status = 1;
    await serviceBooking?.save();

    let serviceBookingData = await ServiceBooking.count({
      where: {
        service_id: serviceBooking.service_id,
        user_id: serviceBooking.user_id,
        status: 0,
      },
    });

    if (serviceBookingData == 0) {
      await Room.update(
        {
          isChatPaused: 1,
        },
        {
          where: {
            userId: serviceBooking?.user_id,
            providerId: service?.provider_id,
          },
        }
      );
    }

    const newNotification = await Notification.create({
      message: `Your booking completed`,
      title: "Booking",
      type: "completeBooking",
      user_id: req.provider ? req.provider.id : req.user.id,
    });

    // const currentUserId = req.provider ? req.provider.userId : req.user.id;
    // const oppositeUserId = serviceBooking.user_id != currentUserId ? serviceBooking.service.provider.userId : currentUserId;
    const oppositeUserId = serviceBooking.user_id;

    const user = await User.findOne({
      where: {
        id: oppositeUserId,
      },
    });

    if (user?.notification_token) {
      await sendNotificationToToken(
        "Booking",
        "Your booking completed",
        null,
        user.notification_token,
        {}
      );
    }

    return success(res, {
      status: true,
      msg: "Your Booking Successfully completed",
      data: [],
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBookingApp: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { page = "1", limit = "10", type = 0 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
      where: { user_id: req.user.id, status: type },
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: Service,
          as: "service",
          attributes: [
            "id",
            "name",
            "image",
            "description",
            "address",
            "rating",
            "hoursPrice",
          ],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name", "icon", "bgColor", "block"],
            },
            {
              model: Provider,
              as: "provider",
              attributes: [
                "id",
                "name",
                "email",
                "experience",
                "profile",
                "createdAt",
                "latitude",
                "longitude",
              ],
              include: [
                {
                  model: ProviderNumbering,
                  as: "providerNumbering",
                  attributes: [
                    "id",
                    "keyName",
                    "amount",
                    "count",
                    "onDiscount",
                    "createdAt",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id"],
        },
      ],
    };

    let { count, rows }: { count: number; rows: any } =
      await ServiceBooking.findAndCountAll({
        ...queryOptions,
        distinct: true,
      });
    rows = await Promise.all(
      rows.map(async (row: any) => {
        row = row.toJSON();
        row["review"] = await Review.findOne({
          where: {
            serviceBookingId: row.id,
          },
        });
        row["serviceBookingNumberings"] = await ServiceBookingNumbering.findAll(
          {
            where: {
              serviceBookingId: row.id,
            },
            include: [
              {
                model: ProviderNumbering,
              },
            ],
          }
        );
        return row;
      })
    );

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

export const getAllBookingForAdmin: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { page = "1", limit = "10", type = 0 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
      where: { status: type },
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: Service,
          as: "service",
          attributes: [
            "id",
            "name",
            "image",
            "description",
            "address",
            "rating",
            "hoursPrice",
          ],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name", "icon", "bgColor", "block"],
            },
            {
              model: Provider,
              as: "provider",
              attributes: [
                "id",
                "name",
                "email",
                "experience",
                "profile",
                "createdAt",
                "latitude",
                "longitude",
              ],
              include: [
                {
                  model: ProviderNumbering,
                  as: "providerNumbering",
                  attributes: [
                    "id",
                    "keyName",
                    "amount",
                    "count",
                    "onDiscount",
                    "createdAt",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: "user",
        },
      ],
    };

    let { count, rows }: { count: number; rows: any } =
      await ServiceBooking.findAndCountAll({
        ...queryOptions,
        distinct: true,
      });
    rows = await Promise.all(
      rows.map(async (row: any) => {
        row = row.toJSON();
        row["review"] = await Review.findOne({
          where: {
            serviceBookingId: row.id,
          },
        });
        row["serviceBookingNumberings"] = await ServiceBookingNumbering.findAll(
          {
            where: {
              serviceBookingId: row.id,
            },
            include: [
              {
                model: ProviderNumbering,
              },
            ],
          }
        );
        return row;
      })
    );

    res.json({
      status: true,
      msg: "Booking retrieved successfully",
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

export const getAllProviderBookingApp: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { page = "1", limit = "10", type = 0 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    let isService = await Service.findOne({
      where: { provider_id: req.provider.id },
    });

    if (!isService) {
      return res.status(404).json({
        status: false,
        msg: "Service not found",
      });
    }

    const queryOptions: any = {
      where: { service_id: isService.id, status: type },
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: Service,
          as: "service",
          attributes: [
            "id",
            "name",
            "image",
            "description",
            "address",
            "rating",
            "hoursPrice",
          ],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name", "icon", "bgColor", "block"],
            },
            {
              model: Provider,
              as: "provider",
              attributes: [
                "id",
                "name",
                "email",
                "experience",
                "profile",
                "createdAt",
                "latitude",
                "longitude",
              ],
              include: [
                {
                  model: ProviderNumbering,
                  as: "providerNumbering",
                  attributes: [
                    "id",
                    "keyName",
                    "amount",
                    "count",
                    "onDiscount",
                    "createdAt",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "profile",
            "fullname",
            "nickname",
            "email",
            "mobileno",
            "gender",
            "occupation",
            "dob",
          ],
        },
      ],
    };

    let { count, rows } = await ServiceBooking.findAndCountAll({
      ...queryOptions,
      distinct: true,
    });
    rows = await Promise.all(
      rows.map(async (row: any) => {
        let e = row.toJSON();
        e["serviceBookingNumberings"] = await ServiceBookingNumbering.findAll({
          where: {
            serviceBookingId: row.id,
          },
          include: [
            {
              model: ProviderNumbering,
            },
          ],
        });
        return e;
      })
    );

    res.json({
      status: true,
      msg: "Booking retrieved successfully",
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
