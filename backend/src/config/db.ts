import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user/user.model";
import { Admin } from "../models/admin/admin.modal";
import { Category } from "../models/admin/category.modal";
import { Service } from "../models/admin/services.nodal";
import { Provider } from "../models/admin/provider.modal";
import { Favourite } from "../models/admin/favourite.modal";
import { Review } from "../models/admin/review.modal";
import { ReviewLike } from "../models/admin/reviewlike.modal";
import { Setting } from "../models/admin/settings.modal";
import { Faq } from "../models/admin/faq.modal";
import { Notification } from "../models/admin/notification.modal";
import { FaqCategory } from "../models/admin/faqcategory.modal";
import { ServiceBooking } from "../models/admin/servicebooking.modal";
import { ServiceMessage } from "../models/admin/servicesmessage.modal";
import { ProviderNumbering } from '../models/admin/providenumbering.modal';
import { ProviderTimeSlot } from '../models/admin/providertimeslot.modal';
import { Room } from "../models/user/room.modal";
import { RoomUser } from "../models/user/roomUser.modal";
import { Message } from "../models/user/message.modal";
import { Slider } from "../models/admin/slider.modal";
import { ServiceBookingNumbering } from "../models/admin/serviceBookingNumbering.modal";
import { Transaction } from "../models/admin/transaction.modal";

export const sequelize = new Sequelize(process.env.DB!, process.env.DB_USER!, process.env.DB_PASS!, {
  host: process.env.DB_HOST!,
  dialect: "mysql",
  dialectOptions: {
    // need to comment before making build
    // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  },
  models: [
    User,
    Admin,
    Category,
    Service,
    Favourite,
    Review,
    Setting,
    Faq,
    Notification,
    FaqCategory,
    ServiceBooking,
    ServiceMessage,
    ReviewLike,
    Provider,
    ProviderNumbering,
    ProviderTimeSlot,
    Room,
    RoomUser,
    Message,
    Slider,
    ServiceBookingNumbering,
    Transaction
  ],
  logging: console.log,
});
