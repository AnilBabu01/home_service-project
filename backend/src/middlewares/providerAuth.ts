import { Request, Response, NextFunction } from "express";
import { Provider } from "../models/admin/provider.modal";
import { verify } from "jsonwebtoken";
import admin from "../firebase";

import dotenv from "dotenv";
import { Op } from "sequelize";
import { User } from "../models/user/user.model";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
  provider?: {
    id?: number | null;
    name: string;
    profile: string;
    email: string;
    password: string;
    userId: number;
  };
  tokenDetail?: {
    id?: number | null;
  };
}

export const isAuthenticatedProvider = async (
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

    let decodedToken: any;
    try {
      decodedToken = verify(token, JWT_SECRET);
      // decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      res.status(401).json({ success: false, msg: "Invalid Token" });
      return;
    }

    if (!decodedToken.user) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    const provider = await Provider.findOne({
      where: {
        id: decodedToken?.user?.id,
      },
    });

    if (!provider) {
      res.status(401).json({ success: false, msg: "Admin not found" });
      return;
    }

    req.provider = {
      id: provider.id,
      name: provider.name,
      profile: provider.profile,
      email: provider.email,
      password: provider.password,
      userId: provider.userId,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const isAuthenticateToken = async (
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

    let decodedToken: any = null;
    let user: any = null;

    try {
      decodedToken = await admin.auth().verifyIdToken(token);

      user = await User.findOne({
        where: {
          [Op.or]: [
            { email: decodedToken.email },
            { mobileno: decodedToken.email },
          ],
        },
      });
    } catch (firebaseError) {
      try {
        decodedToken = verify(token, JWT_SECRET);

        user = await User.findOne({
          where: {
            id: decodedToken?.user?.id,
          },
        });
      } catch (jwtError) {
        res.status(401).json({ success: false, msg: "Invalid Token" });
        return;
      }
    }

    if (!decodedToken) {
      res.status(401).json({ success: false, msg: "Not Authorized" });
      return;
    }

    if (!user) {
      res.status(401).json({ success: false, msg: "User not found" });
      return;
    }

    req.tokenDetail = { id: user.id };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
    return
  }
};
