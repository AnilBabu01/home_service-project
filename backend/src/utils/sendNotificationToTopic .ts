import admin from "../firebase";

export const sendNotificationToTopic = async (
  title: string,
  msg: string,
  imageUrl: string | null,
  topic: string
) => {
  try {
    const message: any = {
      topic: topic,
      notification: {
        title,
        body: msg,
      },
    };

    if (imageUrl) {
      message.notification.image = imageUrl;
    }

    const response = await admin.messaging().send(message);
    return response;
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return error;
  }
};
