import { RequestHandler } from "express";
import { Slider } from "../../models/admin/slider.modal";
import { success, error } from "../../Handlers";


export const activeSliders: RequestHandler = async (
    req: any,
    res: any,
    next: any
): Promise<any> => {
    try {
        const { page = "1", limit = "10", type = 0 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * limitNumber;
        const sliders = await Slider.findAll({
            where: {
                active: true
            },
            order: [["id", "desc"]],
            limit: limitNumber,
            offset: offset
        });

        const count = await Slider.count({});

        return res.json({
            status: true,
            msg: "Sliders retrieved successfully",
            data: sliders,
            pagination: {
                total: count,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(count / limitNumber),
            },
        });


    } catch (err) {
        console.log(err)
        return error(res, {
            status: false,
            msg: "Failed to retrieve settings",
            error: [],
            statuscode: 500,
        });
    }
};

export const index: RequestHandler = async (
    req: any,
    res: any,
    next: any
): Promise<any> => {
    try {
        const { page = "1", limit = "10", type = 0 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * limitNumber;
        const sliders = await Slider.findAll({
            order: [["id", "desc"]],
            limit: limitNumber,
            offset: offset
        });

        const count = await Slider.count({});

        return res.json({
            status: true,
            msg: "Sliders retrieved successfully",
            data: sliders,
            pagination: {
                total: count,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(count / limitNumber),
            },
        });


    } catch (err) {
        console.log(err)
        return error(res, {
            status: false,
            msg: "Failed to retrieve settings",
            error: [],
            statuscode: 500,
        });
    }
};

export const addSlider: RequestHandler = async (
    req: any,
    res: any,
    next: any
): Promise<any> => {
    try {
        const { title } = req.body;
        let payload = {
            title,
            image: req.file ? req.file.path : null,
            active: true
        }

        let slider = await Slider.create(payload);

        return success(res, {
            msg: "Slider added successfully",
            data: [slider]
        })


    } catch (err) {
        return error(res, {
            status: false,
            msg: "Failed to retrieve settings",
            error: [],
            statuscode: 500,
        });
    }
};

export const updateSlider: RequestHandler = async (
    req: any,
    res: any,
    next: any
): Promise<any> => {
    try {
        const { title } = req.body;
        let payload: any = {
            title
        }

        if (req?.file?.path) {
            payload["image"] = req.file ? req.file.path : null
        }

        await Slider.update(payload, {
            where: {
                id: req.params.id
            }
        });

        return success(res, {
            msg: "Slider updated successfully",
            data: []
        })


    } catch (err) {
        return error(res, {
            status: false,
            msg: "Failed to retrieve settings",
            error: [],
            statuscode: 500,
        });
    }
};

export const updateSliderStatus: RequestHandler = async (
    req: any,
    res: any,
    next: any
): Promise<any> => {
    try {
        const { active } = req.body;

        await Slider.update({ active }, {
            where: {
                id: req.params.id
            }
        });

        return success(res, {
            msg: `Slider ${active ? "activated" : "deactivated"} successfully`,
            data: []
        })


    } catch (err) {
        return error(res, {
            status: false,
            msg: "Failed to retrieve settings",
            error: [],
            statuscode: 500,
        });
    }
};

export const deleteSlider: RequestHandler = async (
    req: any,
    res: any,
    next: any
): Promise<any> => {
    try {

        await Slider.destroy({
            where: {
                id: req.params.id
            }
        });

        return success(res, {
            msg: "Slider deleted successfully",
            data: []
        })


    } catch (err) {
        return error(res, {
            status: false,
            msg: "Failed to retrieve settings",
            error: [],
            statuscode: 500,
        });
    }
};