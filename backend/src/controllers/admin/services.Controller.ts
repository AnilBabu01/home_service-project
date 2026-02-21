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

export const createService: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const {
      name,
      category_id,
      providerName,
      providerExperience,
      address,
      providerEmail,
      latitude,
      longitude,
      hoursPrice,
      numberingKeys,
    } = req.body;
    let user = await User.findOne({
      where: {
        email: providerEmail
      }
    });
    if (user) {
      return error(res, {
        msg: "Provider already exists",
      })
    }
    const image = req.file ? req.file.path : null;

    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        status: false,
        msg: "Only image files are allowed!",
      });
    }

    let isService = await Service.findOne({ where: { name } });

    if (isService) {
      error(res, {
        status: false,
        msg: "Service already exists",
        error: [],
        statuscode: 500,
      });
    }

    let iscategory = await Category.findOne({ where: { id: category_id } });
    if (!iscategory) {
      error(res, {
        status: false,
        msg: "Category is not exists",
        error: [],
        statuscode: 500,
      });
    }

    const salt = await genSalt(10);
    const password = generatePassword(providerName);
    const secPass = await hash(password, salt);

    user = await User.create({
      name: providerName,
      email: providerEmail,
      password: secPass
    });

    const isProvider = await Provider.create({
      name: providerName,
      experience: providerExperience,
      email: providerEmail,
      type: "provider",
      password: secPass,
      testPassword: password,
      userId: user.id,
      latitude,
      longitude
    });

    if (isProvider) {
      if (numberingKeys && numberingKeys.trim() !== "empty") {
        try {
          const parsedKeys = JSON.parse(numberingKeys);

          for (const item of parsedKeys) {
            await ProviderNumbering.create({
              keyName: item?.keyName,
              amount: item?.amount,
              onDiscount: item?.onDiscount,
              provider_id: isProvider?.id,
            });
          }
        } catch (parseError) {
          return res.status(400).json({
            status: false,
            msg: "Invalid numberingKeys format",
            error: parseError,
          });
        }
      }

      const newCategory = await Service.create({
        name: name,
        category_id: category_id,
        provider_id: isProvider?.id,
        image: image,
        address: address,

        hoursPrice: hoursPrice,
      });

      success(res, {
        status: true,
        msg: "Service created successfully",
        data: [newCategory],
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getAllServices: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: services } = await Service.findAndCountAll({
      order: [["id", "DESC"]],
      limit,
      offset,
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
              attributes: ["id", "keyName", "amount", "onDiscount", "createdAt"],
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
              // where: { isAvailable: true },
            },
          ],
        },
        {
          model: Favourite,
          as: "favourites",
          attributes: ["id", "isfavourite", "createdAt"],
          // where: { id: 1},
          // required: false,
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email", "profile", "fullname"],
            },
          ],
        },
      ],
      distinct: true,
    });

    success(res, {
      status: true,
      msg: "Services retrieved successfully",
      data: services,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    let service = await Service.findOne({ where: { id } });

    if (!service) {
      error(res, {
        status: false,
        msg: "Service not found",
        error: [],
        statuscode: 404,
      });
    }

    await Service.destroy({ where: { id } });

    success(res, {
      status: true,
      msg: "Service deleted successfully",
      data: [],
    });
  } catch (err) {
    next(err);
  }
};

export const toggleBlock: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log("id   is id ", id);

    let isService = await Service.findByPk(Number(id));

    if (isService) {
      await Service.update(
        {
          block: !isService?.block,
        },
        { where: { id: isService.id } }
      );

      let updatedservice = await Service.findOne({
        where: { id: isService.id },
      });

      res.status(200).json({
        status: true,
        msg: `Service ${updatedservice?.block === true ? "Disable" : "Enable"
          }  Successfully`,
        data: updatedservice,
      });
    } else {
      error(res, {
        status: false,
        msg: "Something went wrong",
        error: [],
        statuscode: 500,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const updateService: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const {
      name,
      category_id,
      provider_id,
      providerName,
      providerExperience,
      address,
      providerEmail,
      latitude,
      longitude,
      hoursPrice,
      numberingKeys
    } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.path : null;

    let isService = await Service.findOne({
      where: { id: Number(id) },
    });

    let isProvider = await Provider.findOne({
      where: { id: Number(provider_id) },
    });

    let updateProvideData: {
      name?: string;
      experience?: string;
      email?: string;
      latitude?: number;
      longitude?: number;
    } = {
      name: providerName,
      experience: providerExperience,
      email: providerEmail,
      latitude,
      longitude
    };

    let updateData: {
      address?: string;
      price?: number;
      isOnDiscount?: number;
      oldPrice?: number;
      hoursPrice?: number;
      name?: string;
      category_id?: string;
      image?: string;
    } = {
      name,
      category_id,
      address,

      hoursPrice,
    };

    if (image) {
      updateData.image = image;
    }

    if (isService && isProvider) {
      await Service.update(updateData, {
        where: { id: id },
      });

      await Provider.update(updateProvideData, {
        where: { id: provider_id },
      });

      await ProviderNumbering.destroy({
        where: { provider_id: provider_id },
      });

      if (numberingKeys && numberingKeys.trim() !== "empty") {
        try {
          const parsedKeys = JSON.parse(numberingKeys);

          for (const item of parsedKeys) {
            await ProviderNumbering.create({
              keyName: item.keyName,
              amount: item?.amount,
              onDiscount: item?.onDiscount,
              provider_id: isProvider.id,
            });
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


export const getAllServicesApp: RequestHandler = async (
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
            "email",
            "mobile_no",
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
              attributes: ["id", "keyName", "amount", "count", "onDiscount", "createdAt"],
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
              // where: { isAvailable: true },
            },
          ],
        },
        {
          model: Favourite,
          as: "favourites",
          attributes: ["id", "isfavourite", "createdAt"],
          where: { user_id: req.user.id },
          required: false,
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
          attributes: ["id", "isAccept", "createdAt"],
          // where: { isAccept: { [Op.in]: ["0"] } },
          // required: false,
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email", "profile", "fullname"],
              where: { id: req.user.id },
              required: false,
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

    let { count, rows } = await Service.findAndCountAll({
      ...queryOptions,
      distinct: true,
    });
    rows = await Promise.all(rows.map(async (row: any) => {
      row = row.toJSON();
      let canGiveReview = await ServiceBooking.findOne({
        where: {
          user_id: req.user.id,
          status: 1
        },
        order: [["id", "desc"]],
        include: [
          {
            model: Service,
            where: {
              provider_id: row.provider_id
            }
          }
        ]
      })
      row["canGiveReview"] = canGiveReview ? (canGiveReview.reviewGiven == false ? true : false) : false;
      return row;
    }))

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

export const getAllFavouriteServicesApp: RequestHandler = async (
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
            "email",
            "mobile_no",
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
              attributes: ["id", "keyName", "amount", "count", "onDiscount", "createdAt"],
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
              // where: { isAvailable: true },
            },
          ],
        },
        {
          model: Favourite,
          as: "favourites",
          attributes: ["id", "isfavourite", "createdAt"],
          where: { user_id: req.user.id },
          required: true,
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
          attributes: ["id", "createdAt"],
          where: { user_id: req.user.id, isAccept: "0" },
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

export const addFavouriteServicesApp: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { service_id } = req.body;

    console.log("Body is", req.body);

    let isFavourite = await Favourite.findOne({
      where: {
        service_id: service_id,
        user_id: req.user.id,
      },
    });

    if (isFavourite) {
      await Favourite.destroy({ where: { id: isFavourite.id } });

      success(res, {
        status: true,
        msg: "Delete favourite successfully",
        data: [],
      });
    } else {
      let createNew = await Favourite.create({
        service_id: service_id,
        user_id: req.user.id,
        isfavourite: true,
      });

      success(res, {
        status: true,
        msg: "Add favourite successfully",
        data: [createNew],
      });
    }
  } catch (error) {
    next(error);
  }
};

export const addReviewServicesApp: RequestHandler = async (
  req: any,
  res: any,
  next
): Promise<any> => {
  try {
    const { service_id, rating, review } = req.body;
    let serviceBooking = await ServiceBooking.findOne({
      where: {
        user_id: req.user.id,
        service_id: service_id
      },
      order: [["id", "desc"]]
    });

    if (!serviceBooking) {
      return error(res, {
        msg: "You haven't booked any service",
      })
    }
    if (serviceBooking.status != 1) {
      return error(res, {
        msg: "Your booking is not completed",
      })
    }
    if (serviceBooking.reviewGiven) {
      return error(res, {
        msg: "You have already given review",
      })
    }
    serviceBooking.reviewGiven = true;
    await serviceBooking.save();
    let createNew = await Review.create({
      service_id: service_id,
      user_id: req.user.id,
      rating: rating,
      review: review
    });

    return success(res, {
      status: true,
      msg: "Review added successfully",
      data: [createNew],
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const addReviewLikeApp: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { review_id } = req.body;
    const user_id = req.user.id;

    // Validate review_id
    if (!review_id) {
      return res
        .status(400)
        .json({ status: false, msg: "Review ID is required" });
    }

    // Check if the like already exists
    let existingLike = await ReviewLike.findOne({
      where: { review_id: Number(review_id), user_id: Number(user_id) },
    });

    if (existingLike) {
      await ReviewLike.destroy({
        where: { id: existingLike.id, user_id: req.user.id },
      });
      return success(res, {
        status: true,
        msg: "Removed review like successfully",
        data: [],
      });
    } else {
      let newLike = await ReviewLike.create({
        review_id: Number(review_id),
        user_id: Number(user_id),
        islike: true,
      });

      return success(res, {
        status: true,
        msg: "Added review like successfully",
        data: [newLike],
      });
    }
  } catch (error) {
    next(error);
  }
};



export const getServiceByIdApp: RequestHandler = async (req: any, res: any, next) => {
  try {
    const { service_id } = req.params;

    if (!service_id) {
      return res.status(400).json({
        status: false,
        msg: "Service ID is required",
      });
    }

    const service = await Service.findOne({
      where: {
        id: service_id,
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
            "id", "name", "email", "mobile_no", "experience",
            "profile", "createdAt", "latitude", "longitude"
          ],
          include: [
            {
              model: ProviderNumbering,
              as: "providerNumbering",
              attributes: ["id", "keyName", "amount", "count", "onDiscount", "createdAt"],
            },
            {
              model: ProviderTimeSlot,
              as: "providerTimeSlot",
              attributes: ["id", "slot", "provider_id", "isAvailable", "createdAt"],
            },
          ],
        },
        {
          model: Favourite,
          as: "favourites",
          attributes: ["id", "isfavourite", "createdAt"],
          where: { user_id: req.user.id },
          required: false,
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
          attributes: ["id", "isAccept", "createdAt"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email", "profile", "fullname"],
              where: { id: req.user.id },
              required: false,
            },
          ],
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        status: false,
        msg: "Service not found",
      });
    }

    const serviceJSON = service.toJSON();

    const canGiveReview = await ServiceBooking.findOne({
      where: {
        user_id: req.user.id,
        status: 1,
      },
      order: [["id", "desc"]],
      include: [
        {
          model: Service,
          where: {
            provider_id: serviceJSON.provider_id,
          },
        },
      ],
    });

    serviceJSON["canGiveReview"] = canGiveReview
      ? !canGiveReview.reviewGiven
      : false;

    res.json({
      status: true,
      msg: "Service retrieved successfully",
      data: serviceJSON,
    });
  } catch (error) {
    next(error);
  }
};
