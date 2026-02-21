import admin from "../firebase"; // Import Firebase Admin SDK

export const sendNotificationToToken = async (
  title: string,
  msg: string,
  imageUrl: string | null,
  fcmToken: string,
  data: object
) => {
  try {
    const message: any = {
      token: fcmToken,
      notification: {
        title,
        body: msg,
      },
      data
    };

    if (imageUrl) {
      message.notification.image = imageUrl;
    }

    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return error;
  }
};
