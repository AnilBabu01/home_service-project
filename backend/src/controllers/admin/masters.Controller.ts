import { RequestHandler } from "express";
import { Category } from "../../models/admin/category.modal";

import { error, success } from "../../Handlers/index";

export const createCategory: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { name, bgColor } = req.body;
    const icon = req.file ? req.file.path : null;

    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        status: false,
        msg: "Only image files are allowed!",
      });
    }

    let isCategory = await Category.findOne({ where: { name } });

    if (isCategory) {
      return res.status(400).json({
        status: false,
        msg: "Category already exists",
        error: [],
      });
    }

    const newCategory = await Category.create({
      name,
      bgColor,
      icon,
    });

    if (newCategory) {
      return res.status(201).json({
        status: true,
        msg: "Category created successfully",
        data: newCategory,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getAllCategories: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: categories } = await Category.findAndCountAll({
      order: [["id", "DESC"]],

      limit,
      offset,
    });

    success(res, {
      status: true,
      msg: "Categories retrieved successfully",
      data: categories,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });

    success(res, {
      status: true,
      msg: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    let category = await Category.findOne({ where: { id } });

    if (!category) {
      error(res, {
        status: false,
        msg: "Category not found",
        error: [],
        statuscode: 404,
      });
    }

    await Category.destroy({ where: { id } });

    success(res, {
      status: true,
      msg: "Category deleted successfully",
      data: [],
    });
  } catch (err) {
    next(err);
  }
};

export const toggleBlock: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    let isCategory = await Category.findOne({
      where: { id: Number(id) },
    });

    if (isCategory) {
      await Category.update(
        {
          block: !isCategory?.block,
        },
        { where: { id: isCategory.id } }
      );

      let updatedCategory = await Category.findOne({
        where: { id: isCategory.id },
      });

      res.status(200).json({
        status: true,
        msg: `Category ${
          updatedCategory?.block === true ?  "Disable" : "Enable"
        }  Successfully`,
        data: updatedCategory,
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

export const updateCategory: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { name, bgColor } = req.body;
    const { id } = req.params;
    const icon = req.file ? req.file.path : null;

    let isCategory = await Category.findOne({ where: { id: Number(id) } });

    if (!isCategory) {
      return res.status(404).json({
        status: false,
        msg: "Category not found",
      });
    }

    let updateData: {
      name?: string;
      bgColor?: string;
      icon?: string;
    } = { name, bgColor };

    if (icon) updateData.icon = icon;

    await Category.update(updateData, { where: { id } });

    let updatedCategory = await Category.findOne({
      where: { id },
    });

    return res.status(200).json({
      status: true,
      msg: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    }
  }
};

export const getAllCategoriesApp: RequestHandler = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        block: false,
      },
      order: [["id", "DESC"]],
    });

    success(res, {
      status: true,
      msg: "Categories retrieved successfully",
      data: categories,
    });

    success(res, {
      status: true,
      msg: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
