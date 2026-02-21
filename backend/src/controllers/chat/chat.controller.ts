import { RequestHandler } from "express";
import { Room } from "../../models/user/room.modal";
import { error, success } from "../../Handlers";
import { User } from "../../models/user/user.model";
import { Provider } from "../../models/admin/provider.modal";
import { Message } from "../../models/user/message.modal";
import { getSocketIo } from "../../helpers/socket.io";
import { Op } from "sequelize";

export const index: RequestHandler = async (req: any, res: any, next): Promise<any> => {
    try {
        let { type = "user" } = req.query;
        let rooms = await Room.findAll({
            where: {
                [`${type == 'user' ? 'userId' : 'providerId'}`]: req.tokenDetail.id
            },
            include: [
                {
                    model: User,
                    attributes: ["fullname", "nickname", "email", ["profile", "image"]]
                },
                {
                    model: Provider,
                    attributes: ["name", "email", ["profile", "image"]]
                },
                {
                    model: Message,
                    attributes: ["id", "message", "seen", "createdAt", "userId", "providerId"],
                    order: [["createdAt", "DESC"]],
                    limit: 1 // Get the last message
                }
            ]
        });

        for (let room of rooms) {
            let unseenMessagesCount = await Message.count({
                where: {
                    roomId: room.id,
                    seen: false,
                    [`${type == 'user' ? 'userId' : 'providerId'}`]: { [Op.ne]: req.tokenDetail.id }
                }
            });

            room.dataValues.unseenMessagesCount = unseenMessagesCount;
        }

        return success(res, {
            msg: "Rooms listed successfully!!",
            data: rooms
        })

    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const getRoomInfoByRoomId: RequestHandler = async (req: any, res: any, next): Promise<any> => {
    try {
        let room = await Room.findOne({
            where: {
                roomId: req.params.roomId
            },
            include: [
                {
                    model: User,
                    attributes: ["fullname", "nickname", "email", ["profile", "image"]]
                },
                {
                    model: Provider,
                    attributes: ["name", "email", ["profile", "image"]]
                }
            ]
        });

        return success(res, {
            msg: "Room data listed successfully!!",
            data: room as any
        });

    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const sendMessage: RequestHandler = async (req: any, res: any, next): Promise<any> => {
    try {
        let payload = req.body;
        let type = payload.type;
        const io = getSocketIo();
        let room = await Room.findOne({
            where: {
                roomId: payload.roomId
            }
        });
        if (!room) {
            return error(res, {
                msg: "Room not found!!",
            })
        }
        if (room.isChatPaused) {
            return error(res, {
                msg: "Chat paused for this room!!",
            })
        }

        let message = await Message.create({
            roomId: room.id,
            message: payload.message,
            userId: type == "user" ? req.tokenDetail.id : null,
            providerId: type == "provider" ? req.tokenDetail.id : null
        });

        let messageData = await getMessageById(message.id);
        io?.emit(room.roomId, messageData, "message");

        return success(res, {
            msg: "Message send successfully!!",
            data: message as any
        });

    } catch (err) {
        console.log(err)
        next(err)
    }
}

const getMessageById = async (id: number | undefined): Promise<Message | null> => {
    let message = await Message.findOne({
        where: {
            id
        },
        include: [
            {
                model: User,
                attributes: ["fullname", "nickname", "email"]
            },
            {
                model: Provider,
                attributes: ["name", "email"]
            }
        ]
    });
    return message;
}

export const getChats: RequestHandler = async (req: any, res: any, next): Promise<any> => {
    try {
        let { page = 1, limit = 10, type = "user" } = req.query;
        page = Number(page);
        limit = Number(limit)

        await Message.update({ seen: true }, { where: { roomId: req.params.roomId, [`${type == 'user' ? 'userId' : 'providerId'}`]: req.tokenDetail.id } });
        let room = await Room.findOne({
            where: {
                roomId: req.params.roomId
            }
        });
        if (!room) {
            return error(res, {
                msg: "Room not found!!",
            })
        }
        let messages = await Message.findAll({
            where: {
                roomId: room.id
            },
            include: [
                {
                    model: User,
                    attributes: ["fullname", "nickname", "email"]
                },
                {
                    model: Provider,
                    attributes: ["name", "email"]
                }
            ],
            order: [["createdAt", "desc"]],
            offset: (page - 1) * limit,
            limit: limit
        });

        return success(res, {
            msg: "Messages listed successfully!!",
            data: messages,
            extraData: room
        })

    } catch (err) {
        console.log(err)
        next(err)
    }
}