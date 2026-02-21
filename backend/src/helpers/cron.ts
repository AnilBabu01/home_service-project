import cron from "node-cron";
import { Message } from "../models/user/message.modal";
import { sendNotificationToToken } from "../utils/webNotification";
import { Room } from "../models/user/room.modal";
import { RoomUser } from "../models/user/roomUser.modal";
import { Provider } from "../models/admin/provider.modal";
import { User } from "../models/user/user.model";



const initCronJobs = () => {
    cron.schedule("*/5 * * * *", async () => {
        console.log("Cron job executed at:", new Date().toLocaleString());
        let messages = await Message.findAll({
            where: {
                seen: false,
                isNotificationSent: false
            }
        });
        console.log("Messages to be sent: ", messages.length);
        messages.map(async (message) => {
            let room = await Room.findOne({
                where: {
                    id: message.roomId
                },
                include: [
                    {
                        model: Provider
                    }
                ]
            });
            let data: any = {
                roomId: room?.roomId
            }
            let user = await User.findOne({
                where: {
                    id: message.userId == room?.userId ? room?.provider.userId : room?.userId
                }
            })
            console.log(user, "user")
            data["page"] = "chat-page/" + room?.roomId;
            let token = user?.notification_token ?? "";
            console.log(token,"=-=-==-")
            await sendNotificationToToken(message.message, "New message", null, token, data);
            await Message.update({ isNotificationSent: true }, { where: { id: message.id } });
            return message;
        })
    });
};

export default initCronJobs;