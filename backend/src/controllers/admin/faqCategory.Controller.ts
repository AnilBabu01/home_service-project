import { RequestHandler } from "express";
import { error, success } from "../../Handlers/index";
import { FaqCategory } from "../../models/admin/faqcategory.modal";

export const createFaqCategory: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { name } = req.body;

    let isFaqCategory = await FaqCategory.findOne({ where: { name } });

    if (isFaqCategory) {
      error(res, {
        status: false,
        msg: "Faq Category already exists",
        error: [],
        statuscode: 500,
      });
    }

    const newFaqCategory = await FaqCategory.create({
      name: name,
      block: false,
    });

    success(res, {
      status: true,
      msg: "Faq Category created successfully",
      data: [newFaqCategory],
    });
  } catch (err) {
    next(err);
  }
};

export const getAllFaqCategory: RequestHandler = async (req, res, next) => {
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

    const { count, rows } = await FaqCategory.findAndCountAll(queryOptions);

    res.json({
      status: true,
      msg: "Faq category retrieved successfully",
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

export const deleteFaqCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    let faqCategory = await FaqCategory.findOne({ where: { id } });

    if (!faqCategory) {
      error(res, {
        status: false,
        msg: "Faq not found",
        error: [],
        statuscode: 404,
      });
    }

    await FaqCategory.destroy({ where: { id } });

    success(res, {
      status: true,
      msg: "Faq Category deleted successfully",
      data: [],
    });
  } catch (err) {
    next(err);
  }
};

export const toggleBlock: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    let isFaqCategory = await FaqCategory.findOne({
      where: { id: id },
    });

    if (isFaqCategory) {
      await FaqCategory.update(
        {
          block: !isFaqCategory?.block,
        },
        { where: { id: isFaqCategory.id } }
      );

      let updatedfaq = await FaqCategory.findOne({
        where: { id: isFaqCategory.id },
      });

      res.status(200).json({
        status: true,
        msg: `Faq Category ${
          updatedfaq?.block === true ? "Disable" : "Enable"
        }  Successfully`,
        data: updatedfaq,
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

export const updateFaqCategory: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    let isFaqCategory = await FaqCategory.findOne({
      where: { id: Number(id) },
    });

    let updateData: {
      name?: string;
    } = {
      name,
    };

    if (isFaqCategory) {
      await FaqCategory.update(updateData, {
        where: { id: id },
      });

      let updatedFaqCategory = await FaqCategory.findOne({
        where: { id: isFaqCategory.id },
      });

      res.status(200).json({
        status: true,
        msg: "Faq updated Successfully",
        user: updatedFaqCategory,
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

export const getAllFaqCategoryApp: RequestHandler = async (req, res, next) => {
  try {
    const rows = await FaqCategory.findAll({});

    res.json({
      status: true,
      msg: "Faq Category retrieved successfully",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
