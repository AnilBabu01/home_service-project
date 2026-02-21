import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { Validate } from "./Validation";

export const RegisterValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    // password: Joi.string().required(),
    // countryCode: Joi.string().required(),
  });

  await Validate(req, res, next, schema);
};

export const ProfileValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    fullname: Joi.string().optional(),
    mobileno: Joi.string().optional(),
    gender: Joi.string().optional(),
    occupation: Joi.string().optional(),
    countryCode:Joi.string().optional(),
    dob: Joi.string().optional(),
    email: Joi.string().email().required(),
    nickname: Joi.optional(),
    latitude: Joi.optional().allow(null, ""),
    longitude: Joi.optional().allow(null, ""),

  });

  await Validate(req, res, next, schema);
};


export const LoginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().optional().allow("",null),
    notification_token: Joi.string().required(),
  });

  await Validate(req, res, next, schema);
};

export const RegisterAdminValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  await Validate(req, res, next, schema);
};

export const LoginAdminValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  await Validate(req, res, next, schema);
};

export const AddCetegoryValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    bgColor: Joi.string().required(),

  });

  await Validate(req, res, next, schema);
};


export const UpdateCetegoryValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    bgColor: Joi.string().required(),

  });

  await Validate(req, res, next, schema);
};


export const AddServiceValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    category_id: Joi.string().required(),
    providerName: Joi.string().required(),
    providerExperience: Joi.string().required(),
    address: Joi.string().required(),
    providerEmail: Joi.string().required(),
    price: Joi.string().optional(),
    isOnDiscount: Joi.string().optional(),
    oldPrice: Joi.string().optional(),
    hoursPrice: Joi.string().required(),
    numberingKeys: Joi.string().optional(),
    inputType: Joi.string().optional()
  });

  await Validate(req, res, next, schema);
};

export const UpdateServiceValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    category_id: Joi.string().required(),
    provider_id: Joi.string().required(),
    providerName: Joi.string().required(),
    providerExperience: Joi.string().required(),
    address: Joi.string().required(),
    providerEmail: Joi.string().required(),
    price: Joi.string().optional(),
    isOnDiscount: Joi.string().optional(),
    oldPrice: Joi.string().optional(),
    hoursPrice: Joi.string().required(),
    numberingKeys: Joi.string().optional(),
    inputType: Joi.string().optional()
  });

  await Validate(req, res, next, schema);
};

export const AddFaqValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    category_id: Joi.string().required(),
  });

  await Validate(req, res, next, schema);
};

export const UpdateFaqValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    category_id: Joi.string().required(),
  });

  await Validate(req, res, next, schema);
};

export const SendNotificationValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    message: Joi.string().required(),
    type: Joi.string().required(),
    title: Joi.string().required(),
    user_id: Joi.number().optional(),
  });

  await Validate(req, res, next, schema);
};

export const SettingValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    privacyPolicy: Joi.string().optional(),
    customerServices: Joi.string().optional(),
    Website: Joi.string().optional(),
    facebook: Joi.string().optional(),
    twitter: Joi.string().optional(),
    instagram: Joi.string().optional(),
    whatsapp: Joi.string().optional(),
    advanceAmountPercentage: Joi.number().optional()
  });

  await Validate(req, res, next, schema);
};

export const AddFaqCategoryValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  await Validate(req, res, next, schema);
};

export const UpdateFaqCategoryValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  await Validate(req, res, next, schema);
};
