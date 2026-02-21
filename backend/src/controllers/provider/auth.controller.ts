import { RequestHandler } from "express";
import { Provider } from "../../models/admin/provider.modal";
import { Service } from "../../models/admin/services.nodal";
import { ServiceBooking } from "../../models/admin/servicebooking.modal";
import { User } from "../../models/user/user.model";
import { ProviderNumbering } from "../../models/admin/providenumbering.modal";
import { ProviderTimeSlot } from "../../models/admin/providertimeslot.modal";
import { Notification } from "../../models/admin/notification.modal";
import { Category } from "../../models/admin/category.modal";

import jwt from "jsonwebtoken";
import { hash, genSalt, compare } from "bcryptjs";
import { error, success } from "../../Handlers/index";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const {
      email,
      password,
      notification_token
    }: { username: string; email: string; password: string; notification_token: string } = req.body;

    console.log("em", email, password);

    if (!email) {
      res.status(401).json({ msg: "email required", status: false });
    }
    if (!password) {
      res.status(401).json({ msg: "password required", status: false });
    }
    let user = await Provider.findOne({ where: { email: email } });
    if (!user) {
      res.status(401).json({ status: false, msg: "User name not exists" });
    } else {
      const matchpassword = await compare(password, user.password);

      if (!matchpassword) {
        res.status(401).json({ status: false, msg: "User name not exists" });
      } else {
        const data = {
          user: {
            id: user.id,
          },
        };
        if (notification_token) {
          user.notification_token = notification_token;
          await user.save();
          await User.update({
            notification_token
          }, {
            where: {
              id: user.userId
            }
          })
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
    }
  } catch (error) {
    next(error);
  }
};

export const getprofile: RequestHandler = async (req: any, res: any, next) => {
  try {
    if (!req?.provider?.id) {
      return res.status(401).json({
        status: false,
        msg: "Unauthorized, please login",
      });
    }

    let user = await Provider.findOne({
      where: { id: req.provider.id },
      include: [
        {
          model: Service,
          as: "services",
          attributes: [
            "id",
            "name",
            "image",
            "description",
            "address",
            "hoursPrice",
          ],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name", "icon", "bgColor", "block"],
            },
          ],
        },
        {
          model: ProviderNumbering,
          as: "providerNumbering",
          attributes: [
            "id",
            "keyName",
            "amount",
            "count",
            "onDiscount",
            "createdAt",
          ],
        },
        {
          model: ProviderTimeSlot,
          as: "providerTimeSlot",
          attributes: ["id", "slot", "provider_id", "isAvailable", "createdAt"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        msg: "Provider not found",
      });
    }

    res.status(200).json({
      status: true,
      msg: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (
  req: any,
  res: any,
  next
) => {
  try {
    const { name, mobile_no, experience, email, password, latitude, longitude, countryCode } = req.body;
    const profileImage = req.file ? req.file.path : null;

    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        status: false,
        msg: "Only image files are allowed!",
      });
    }

    let updateData: any = {};
    if (name) updateData.name = name;
    if (mobile_no) updateData.mobile_no = mobile_no;
    if (experience) updateData.mobileno = experience;
    if (email) updateData.email = email;
    if (password) {
      const salt = await genSalt(10);
      const secPass = await hash(password, salt);

      updateData.password = secPass;
      updateData.testPassword = password;
    }
    if (profileImage) updateData.profile = profileImage;
    updateData.profilefilled = true;
    let user = await Provider.findOne({
      where: { id: req.provider?.id },
    });
    if (latitude) updateData.latitude = latitude;
    if (longitude) updateData.longitude = longitude;
    if (countryCode) updateData.countryCode = countryCode;

    if (user) {
      await Provider.update(updateData, { where: { id: req?.provider?.id } });
      await User.update(updateData, {
        where: {
          id: user.userId
        }
      });

      user = await Provider.findOne({
        where: { id: req?.provider?.id },
      });

      return success(res, {
        status: true,
        msg: "Your profile updated successfully",
        data: [user],
      });
    }

    return error(res, {
      status: false,
      msg: "User not found",
      error: [],
      statuscode: 500,
    });
  } catch (err) {
    next(err);
  }
};
