import { PermissionsAndroid, Platform, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { initializeApp } from "@react-native-firebase/app";
import { firebaseConfig } from "@/firebaseConfig";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig.config);

// Request all permissions for notifications
export async function requestUserPermission() {
  try {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Notification permission granted.");
      return await getToken();
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting permissions:", error);
  }
}

async function getToken() {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM Token:", error);
  }
}

export function setupForegroundNotificationHandler(
  setRoomId: (id: string) => void
) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // Foreground
  messaging().onMessage(async (remoteMessage: any) => {
    console.log("Foreground Notification:", remoteMessage.notification);

    // await Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: remoteMessage.notification?.title || "New Notification",
    //     body: remoteMessage.notification?.body || "You have a new message",
    //   },
    //   trigger: null,
    // });
  });

  // When app is opened from background
  // messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
  //   console.log("onNotificationOpenedApp Notification:", remoteMessage);

  //   if (remoteMessage?.data?.roomId) {
  //     console.log("Room ID (opened app):", remoteMessage.data.roomId);
  //     setRoomId(remoteMessage.data.roomId);
  //   }
  // });

  // Background handler
  messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    console.log("Background Notification:", remoteMessage);
    console.log("Notification Title:", remoteMessage?.notification?.title);
    console.log("Notification Body:", remoteMessage?.notification?.body);
    console.log("Page:", remoteMessage?.data?.page);
    console.log("Room ID:", remoteMessage?.data?.roomId);

    if (remoteMessage?.data?.roomId) {
      // Unfortunately, can't set state from background handler,
      // so you might want to store it in local storage instead.
    }
  });
}

export async function subscribeToTopic(topic: string) {
  try {
    await messaging().subscribeToTopic("provider_topic");
    console.log(`Subscribed to topic provider_topic: ${"provider_topic"}`);
  } catch (error) {
    console.error(`Error subscribing to topic: ${error}`);
  }
}

export const getLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access in settings.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    return location;
  } catch (error) {
    // Alert.alert("Error", "Failed to fetch location.");
    console.error(error);
  }
};
