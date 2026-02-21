import { RequestHandler } from "express";
import { User } from "../../models/user/user.model";
import jwt from "jsonwebtoken";
import { hash, genSalt, compare } from "bcryptjs";
import { error, success } from "../../Handlers/index";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(401).json({ msg: "email is  required", status: false });
    }
    // if (!password) {
    //   res.status(401).json({ msg: "password is  required", status: false });
    // }

    let user = await User.findOne({ where: { email: email } });

    if (user) {
      res
        .status(401)
        .json({ status: false, msg: "User Allready exist with email" });
    } else {
      const salt = await genSalt(10);
      // const secPass = await hash(password, salt);
      user = await User.create({
        email: email,
        // password: secPass,
        
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);

      res.status(200).json({
        status: true,
        token: token,
        msg: "You have register successfully",
        user: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const changePassword: RequestHandler = async (req: any, res: any, next): Promise<any> => {
  try {
    let payload = req.body;
    const user = await User.findOne({
      where: { id: req.user?.id },
    });
    if (!user) {
      return error(res, {
        status: false,
        msg: "User not found",
        error: [],
        statuscode: 500,
      });
    }
    const isMatch = await compare(payload.oldPassword, user.password);
    if(!isMatch) {
      return error(res, {
        status: false,
        msg: "Old password is incorrect",
        error: [],
        statuscode: 500,
      });
    }
    const salt = await genSalt(10);
    const secPass = await hash(payload.password, salt);
    await User.update({ password: secPass }, { where: { id: req.user?.id } });
    return success(res, { msg: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const {
      email,
      // password,
      notification_token
    }: { username: string; email: string; password: string, notification_token: string } = req.body;

    if (!email) {
      res.status(401).json({ msg: "email required", status: false });
    }
    // if (!password) {
    //   res.status(401).json({ msg: "password required", status: false });
    // }
    let user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(401).json({ status: false, msg: "User name not exists" });
    } else {
      // const matchpassword = await compare(password, user.password);

      // if (!matchpassword) {
      //   res.status(401).json({ status: false, msg: "User name not exists" });
      // } else {
        const data = {
          user: {
            id: user.id,
          },
        };
        if (notification_token) {
          user.notification_token = notification_token;
          await user.save();
        }

        console.log(data);
        const token = jwt.sign(data, JWT_SECRET);

        res.status(200).json({
          status: true,
          token: token,
          msg: "You have login successfully",
          user: user,
        });
      }
    // }
  } catch (error) {
    next(error);
  }
};

export const completeProfile: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { fullname, nickname, mobileno, dob, gender, occupation, latitude, longitude, countryCode } = req.body;
    const profileImage = req.file ? req.file.path : null;

    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        status: false,
        msg: "Only image files are allowed!",
      });
    }

    let updateData: any = {};
    if (fullname) updateData.fullname = fullname;
    if (nickname) updateData.nickname = nickname;
    if (mobileno) updateData.mobileno = mobileno;
    if (occupation) updateData.occupation = occupation;
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;
    if (profileImage) updateData.profile = profileImage;
    if (latitude) updateData.latitude = latitude;
    if (longitude) updateData.longitude = longitude;
    if (countryCode) updateData.countryCode = countryCode;
    updateData.profilefilled = true;
    let user = await User.findOne({
      where: { id: req.user?.id },
    });

    if (user) {
      await User.update(updateData, { where: { id: req?.user?.id } });

      user = await User.findOne({
        where: { id: req?.user?.id },
      });

      return success(res, {
        status: true,
        msg: "Your profile completed successfully",
        data: [user],
      }); // ✅ Added return statement
    }

    return error(res, {
      status: false,
      msg: "User not found",
      error: [],
      statuscode: 500,
    }); // ✅ Added return statement
  } catch (err) {
    next(err);
  }
};

export const getprofile: RequestHandler = async (req: any, res: any, next) => {
  try {
    let user = await User.findOne({
      where: { id: req?.user?.id },
    });
    if (!user) {
      res.status(401).json({
        status: false,
        msg: "Please login",
        user: user,
      });
    }
    res.status(200).json({
      status: true,
      msg: "Profile fetch successfully",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
