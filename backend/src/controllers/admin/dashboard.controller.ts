import { RequestHandler } from "express";
import { error, success } from "../../Handlers/index";
import { Faq } from "../../models/admin/faq.modal";
import { FaqCategory } from "../../models/admin/faqcategory.modal";
import { Op } from "sequelize";
import { User } from "../../models/user/user.model";
import { Provider } from "../../models/admin/provider.modal";
import { ServiceBooking } from "../../models/admin/servicebooking.modal";

export const getAllDashboardData: RequestHandler = async (req, res, next): Promise<any> => {
    try {
        let users = await User.count({
            where: {
                userType: "user"
            }
        });
        let providers = await Provider.count({});
        let cancelledBooking = await ServiceBooking.count({
            where: {
                status: 2
            }
        });
        let completedBooking = await ServiceBooking.count({
            where: {
                status: 1
            }
        });
        let upcomingBooking = await ServiceBooking.count({
            where: {
                status: 0
            }
        });
        return success(res, {
            msg: "Dashboard details listed successfully!!",
            data: [{
                upcomingBookingCount: upcomingBooking,
                completedBookingCount: completedBooking,
                cancelledBookingCount: cancelledBooking,
                usersCount: users,
                providersCount: providers
            }]
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};
