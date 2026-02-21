import { RequestHandler } from "express";
import { User } from "../../models/user/user.model";
import { Provider } from "../../models/admin/provider.modal";
import { success } from "../../Handlers";

export const index: RequestHandler = async (req: any, res: any, next): Promise<any> => {
    try {
        const { page = "1", limit = "10", type = 0 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * limitNumber;
        let users: any = await User.findAll({
            order: [["id", "desc"]],
            limit: limitNumber,
            offset
        });
        users = await Promise.all(users.map(async (e: any) => {
            e = e.toJSON();
            e["provider"] = await Provider.findOne({
                where: {
                    userId: e.id
                }
            })
            return e;
        }))
        let count = await User.count({});
        return res.json({
            status: true,
            msg: "Booking retrieved successfully",
            data: users,
            pagination: {
                total: count,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(count / limitNumber),
            },
        });
    } catch (err) {
        console.log(err)
        next(err);
    }
}

export const updateUser: RequestHandler = async (
    req: any,
    res: any,
    next
): Promise<any> => {
    try {
        const { status, fullname, nickname } = req.body;

        await User.update({ status, fullname, nickname }, { where: { id: req.params.userId } });

        return res.status(200).json({
            status: true,
            msg: "Profile updated Successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const updateStatus: RequestHandler = async (
    req: any,
    res: any,
    next
): Promise<any> => {
    try {
        const { status } = req.body;

        await User.update({ status }, { where: { id: req.params.userId } });

        return res.status(200).json({
            status: true,
            msg: `Profile ${status == 1 ? "unblocked" : "blocked"} Successfully`,
        });
    } catch (error) {
        next(error);
    }
};