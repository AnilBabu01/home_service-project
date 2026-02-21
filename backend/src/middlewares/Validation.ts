import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { error } from "../Handlers";

export const Validate = async (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Joi.ObjectSchema
): Promise<void> => {
  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (err: any) {
    error(res, {
      status: false,
      msg: err.details ? err.details[0].message : "Validation error",
      error: err.details || err.message,
      statuscode: 400,
    });
    return;
  }
};
