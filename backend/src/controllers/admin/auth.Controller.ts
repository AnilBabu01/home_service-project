import { RequestHandler } from "express";
import { Admin } from "../../models/admin/admin.modal";
import jwt from "jsonwebtoken";
import { hash, genSalt, compare } from "bcryptjs";
import dotenv from "dotenv";
import { error } from "../../Handlers";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ where: { email: email } });

    if (admin) {
      return res
        .status(401)
        .json({ status: false, msg: "User Already exist with email" });
    }
    const salt = await genSalt(10);
    const secPass = await hash(password, salt);
    admin = await Admin.create({
      email: email,
      password: secPass,
    });
    const data = {
      admin: {
        id: admin.id,
      },
    };
    const token = jwt.sign(data, JWT_SECRET);

    res.status(200).json({
      status: true,
      token: token,
      msg: "You have register successfully",
      user: admin,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const saveNotificationToken: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { notification_token } = req.body;

    let isAdmin = await Admin.findOne({
      where: { id: req?.admin?.id },
    });
    if (!isAdmin) {
      return error(res, {
        msg: "Admin not found"
      });
    }
    await Admin.update(
      {
        notification_token: notification_token,
      },
      { where: { id: req?.admin?.id } }
    );

    let admin = await Admin.findOne({
      where: { id: req?.admin?.id },
    });

    return res.status(200).json({
      status: true,
      msg: "Notification token updated Successfully",
      user: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req: any, res: any, next) => {
  try {
    const {
      email,
      password,
    }: { username: string; email: string; password: string } = req.body;

    let admin = await Admin.findOne({ where: { email: email } });
    if (!admin) {
      return res
        .status(401)
        .json({ status: false, msg: "User name not exists" });
    }

    const matchPassword = await compare(password, admin.password);

    if (!matchPassword) {
      return res
        .status(401)
        .json({ status: false, msg: "User name not exists" });
    }
    const data = {
      admin: {
        id: admin.id,
      },
    };

    const token = jwt.sign(data, JWT_SECRET);

    return res.status(200).json({
      status: true,
      token: token,
      msg: "You have login Successfully",
      user: admin,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateprofile: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { name, password } = req.body;
    const profileImage = req.file ? req.file.path : null;

    console.log("ss", profileImage);

    let isAdmin = await Admin.findOne({
      where: { id: req?.admin?.id },
    });

    if (!isAdmin) {
      return error(res, {
        msg: "Admin not found"
      })
    }
    let payload: { profile: string; } = {
      profile: profileImage
    }

    await Admin.update(
      payload,
      { where: { id: req?.admin?.id } }
    );

    let admin = await Admin.findOne({
      where: { id: req?.admin?.id },
    });

    return res.status(200).json({
      status: true,
      msg: "Profile updated Successfully",
      user: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const getprofile: RequestHandler = async (req: any, res: any, next) => {
  try {
    let admin = await Admin.findOne({
      where: { id: req?.admin?.id },
    });
    return res.status(200).json({
      status: true,
      msg: "Profile fetch Successfully",
      user: admin,
    });
  } catch (error) {
    next(error);
  }
};


export const updateProfile: RequestHandler = async (req: any, res: any, next) => {
  try {
    await Admin.update(req.body, { where: { id: req?.admin?.id } });
    return res.status(200).json({
      status: true,
      msg: "Profile updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};
