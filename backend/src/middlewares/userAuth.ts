import { Request, Response, NextFunction } from "express";
import { User } from "../models/user/user.model";
import { verify } from "jsonwebtoken";

import dotenv from "dotenv";
import admin from "../firebase";
import { Op } from "sequelize";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
  user?: any
}

export const isAuthenticatedUser = async (
  req: AuthRequest,
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
      // validate = verify(token, JWT_SECRET);
      validate = await admin.auth().verifyIdToken(token);
    } catch (error) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    if (!validate.email  && !validate.mobileno) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    const user = await User.findOne({
      where: { 
        [Op.or] : [
          {
            email: validate.email,
          },
          {
            mobileno: validate.email,
          }
        ]
       },
    });

    if (!user) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    if (user.status == 2) {
      res.status(401).json({ success: false, msg: "Your account has been blocked" });
      return;
    }

    (req as AuthRequest).user = {
      id: user.id as number,
      fullname: user.fullname,
      nickname: user.nickname,
      email: user.email,
      mobileno: user.mobileno,
      gender: user.gender,
      occupation: user.occupation,
      dob: user.dob,
      profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      userType: user.userType
    };

    next();
  } catch (error) {
    next(error);
  }
};
