import { RequestHandler } from "express";
import { error, success } from "../../Handlers/index";
import { Faq } from "../../models/admin/faq.modal";
import { FaqCategory } from "../../models/admin/faqcategory.modal";
import { Op } from "sequelize";

export const createFaq: RequestHandler = async (req: any, res: any, next) => {
  try {
    const { question, answer, category_id } = req.body;

    let isFaq = await Faq.findOne({ where: { question } });

    if (isFaq) {
      error(res, {
        status: false,
        msg: "Faq already exists",
        error: [],
        statuscode: 500,
      });
    }

    const newFaq = await Faq.create({
      question: question,
      answer: answer,
      category_id: category_id,
      block: false,
    });

    success(res, {
      status: true,
      msg: "Faq created successfully",
      data: [newFaq],
    });
  } catch (err) {
    next(err);
  }
};

export const getAllFaq: RequestHandler = async (req, res, next) => {
  try {
    const { page = 1, limit = 2 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: FaqCategory,
          as: "faqCategory",
          attributes: ["id", "name", "block"],
        },
      ],
    };

    const { count, rows } = await Faq.findAndCountAll(queryOptions);

    res.json({
      status: true,
      msg: "Faq retrieved successfully",
      data: rows,
      pagination: {
        totalItems: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFaq: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    let faq = await Faq.findOne({ where: { id } });

    if (!faq) {
      error(res, {
        status: false,
        msg: "Faq not found",
        error: [],
        statuscode: 404,
      });
    }

    await Faq.destroy({ where: { id } });

    success(res, {
      status: true,
      msg: "Faq deleted successfully",
      data: [],
    });
  } catch (err) {
    next(err);
  }
};

export const toggleBlock: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    let isFaq = await Faq.findOne({ where: { id: id } });

    if (isFaq) {
      await Faq.update(
        {
          block: !isFaq?.block,
        },
        { where: { id: isFaq.id } }
      );

      let updatedfaq = await Faq.findOne({
        where: { id: isFaq.id },
      });

      res.status(200).json({
        status: true,
        msg: `Faq ${
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

export const updateFaq: RequestHandler = async (req, res, next) => {
  try {
    const { question, answer, categoryId } = req.body;
    const { id } = req.params;

    let isFaq = await Faq.findOne({
      where: { id: Number(id) },
    });

    let updateData: {
      question?: string;
      answer?: string;
      categoryId?: number;
    } = {
      question,
      answer,
      categoryId,
    };

    if (isFaq) {
      await Faq.update(updateData, {
        where: { id: id },
      });

      let updatedFaq = await Faq.findOne({
        where: { id: isFaq.id },
      });

      res.status(200).json({
        status: true,
        msg: "Faq updated Successfully",
        user: updatedFaq,
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

export const getAllFaqApp: RequestHandler = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, categories = [] } = req.body;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
      where: {
        block: false,
      },
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: FaqCategory,
          as: "faqCategory",
          attributes: ["id", "name", "block"],
        },
      ],
    };

 
    if (categories && Array.isArray(categories) && categories.length > 0) {
      queryOptions.where.category_id = { [Op.in]: categories };
    }

    const { count, rows } = await Faq.findAndCountAll(queryOptions);

    res.json({
      status: true,
      msg: "Faq retrieved successfully",
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
