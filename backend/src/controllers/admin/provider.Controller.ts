import { RequestHandler } from "express";
import { Service } from "../../models/admin/services.nodal";
import { Category } from "../../models/admin/category.modal";
import { Favourite } from "../../models/admin/favourite.modal";
import { Review } from "../../models/admin/review.modal";
import { Provider } from "../../models/admin/provider.modal";
import { ReviewLike } from "../../models/admin/reviewlike.modal";
import { User } from "../../models/user/user.model";
import { error, success } from "../../Handlers/index";
import { Model, Op, where } from "sequelize";
import { hash, genSalt } from "bcryptjs";
import { generatePassword } from "../../Handlers/index";
import { ProviderNumbering } from "../../models/admin/providenumbering.modal";
import { ProviderTimeSlot } from "../../models/admin/providertimeslot.modal";
import { ServiceBooking } from "../../models/admin/servicebooking.modal";

export const updateProvider: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const {
      provider_id,
      providerName,
      providerExperience,
      providerEmail,
      hoursPrice,
      numberingKeys,
    } = req.body;
    const { id } = req.params;

    let isService = await Service.findOne({ where: { id: Number(id) } });
    let isProvider = await Provider.findOne({
      where: { id: Number(provider_id) },
    });

    let updateProvideData: {
      name?: string;
      experience?: string;
      email?: string;
    } = {
      name: providerName,
      experience: providerExperience,
      email: providerEmail,
    };

    let updateData: { hoursPrice?: number } = { hoursPrice };

    if (isService && isProvider) {
      await Service.update(updateData, { where: { id: id } });
      await Provider.update(updateProvideData, { where: { id: provider_id } });

      if (numberingKeys && numberingKeys.trim() !== "empty") {
        try {
          const parsedKeys = JSON.parse(numberingKeys);

          for (const item of parsedKeys) {
            let existingNumbering = await ProviderNumbering.findOne({
              where: { id: item.id },
            });

            if (existingNumbering) {
              await existingNumbering.update({
                amount: item?.amount,
                onDiscount: item?.onDiscount,
              });
            } else {
              await ProviderNumbering.create({
                keyName: item.keyName,
                amount: item?.amount,
                onDiscount: item?.onDiscount,
                provider_id: isProvider.id,
              });
            }
          }
        } catch (parseError) {
          return res.status(400).json({
            status: false,
            msg: "Invalid numberingKeys format",
            error: parseError,
          });
        }
      }

      let updatedService = await Service.findOne({
        where: { id: isService.id },
      });

      res.status(200).json({
        status: true,
        msg: "Service updated Successfully",
        user: updatedService,
      });
    } else {
      error(res, {
        status: false,
        msg: "Something went wrong",
        error: [],
        statuscode: 500,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProviderPassword: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const {
      password
    } = req.body;
    const { id } = req.params;
    const provider = await Provider.findOne({
      where: {
        id: id
      }
    });
    if(!provider){
      return res.status(404).json({
        status: false,
        msg: "Provider not found",
      });
    }
    const salt = await genSalt(10);
    const secPass = await hash(password, salt);
    await User.update({
      password: secPass,
      testPassword: password,
    }, {
      where: {
        id: provider.userId
      }
    });
    return res.status(200).json({
      status: true,
      msg: "Password updated successfully",
    });
    
  } catch (error) {
    next(error);
  }
};

export const getAllProviderList: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { category_id } = req.params;

    const { page = 1, limit = 10, categories = [] } = req.body;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
      where: {
        block: false,
      },
      order: [["id", "DESC"]],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "icon", "bgColor", "block"],
        },
        {
          model: Review,
          as: "reviews",
          attributes: ["id", "rating", "review", "createdAt"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email", "profile", "fullname"],
            },
            {
              model: ReviewLike,
              as: "reviewLike",
              attributes: ["id", "islike", "createdAt"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "email", "profile", "fullname"],
                },
              ],
            },
          ],
        },
        {
          model: Provider,
          as: "provider",
          attributes: [
            "id",
            "name",
            "mobile_no",
            "email",
            "experience",
            "profile",
            "createdAt",
            "latitude",
            "longitude"
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
            {
              model: ProviderTimeSlot,
              as: "providerTimeSlot",
              attributes: [
                "id",
                "slot",
                "provider_id",
                "isAvailable",
                "createdAt",
              ],
            },
          ],
        },
        {
          model: Favourite,
          as: "favourites",
          attributes: ["id", "isfavourite", "createdAt"],

          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email", "profile", "fullname"],
            },
          ],
        },
        {
          model: ServiceBooking,
          as: "serviceBookings",
          attributes: [
            "id",
            "date",
            "time",
            "status",
            "amount",
            "transactionId",
            "address",
            "paymentMethod",
            "barcode",
            "tax",
            "totalAmount",
            "service_id",
            "user_id",
            "time_slot_id",
            "isAccept",
            "createdAt",
          ],
          where: { isAccept: { [Op.in]: ["0"] } },
          required: false,
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email", "profile", "fullname"],
            },
          ],
        },
      ],
      limit: limitNumber,
      offset,
    };

    if (category_id) {
      queryOptions.where.category_id = category_id;
    }

    if (categories && Array.isArray(categories) && categories.length > 0) {
      queryOptions.where.category_id = { [Op.in]: categories };
    }

    const { count, rows } = await Service.findAndCountAll({
      ...queryOptions,
      distinct: true,
    });

    res.json({
      status: true,
      msg: "Services retrieved successfully",
      data: rows,
      pagination: {
        totalItem: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTimeSlots: RequestHandler = async (
  req: any,
  res: any,
  next
): Promise<any> => {
  try {
    const { providerId } = req.params;
    let data = await ProviderTimeSlot.findAll({
      where: {
        provider_id: providerId,
        isAvailable: true
      }
    });

    return res.json({
      status: true,
      msg: "Services time slot successfully listed",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};