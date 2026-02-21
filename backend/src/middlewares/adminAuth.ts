import { Request, Response, NextFunction } from "express";
import { Admin } from "../models/admin/admin.modal";
import { verify } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
  admin?: {
    id?: number | null;
    adminType: string;
    name: string;
    profile: string;
    email: string;
    password: string;
  };
}
export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    let validate: any;

    try {
      validate = verify(token, JWT_SECRET);
    } catch (error) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    if (!validate.admin) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    const admin = await Admin.findOne({
      where: { id: validate.admin.id },
    });

    if (!admin) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    (req as AuthRequest).admin = {
      id: admin.id,
      adminType: admin.adminType,
      name: admin.name,
      profile: admin.profile,
      email: admin.email,
      password: admin.password,
    };

    next();
  } catch (error) {
    next(error);
  }
};
