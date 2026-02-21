import { Stack, useRouter } from "expo-router";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { serverinstance } from "../../lib/react-query/serverinstamce";
import FlashMessage from "react-native-flash-message";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import {
  requestUserPermission,
  setupForegroundNotificationHandler,
  subscribeToTopic,
  getLocation,
} from "../components/PushNotification";
import "react-native-get-random-values";
import { Image } from "react-native";
import { width, height } from "../utils/responsuve";
export default function RootLayout() {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<any>(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  useEffect(() => {
    setTimeout(() => {
      setIsSplashVisible(false);
      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    }, 1000);

    requestUserPermission().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    subscribeToTopic("provider-topic");
    setupForegroundNotificationHandler(setRoomId);
    getLocation();
  }, []);

  console.log("roomId  from app open fun", roomId);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <ApiProvider api={serverinstance}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="timeslot" />
        <Stack.Screen name="EReceipt" />
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="Chat" />
        <Stack.Screen name="CancelBooking" />
        <Stack.Screen name="BookingDetails" />
        <Stack.Screen name="LiveMap" />
      </Stack>
      <FlashMessage position="top" />
    </ApiProvider>
  );
}

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/nowLogo.png")}
        style={styles.logo}
      />
      {/* <ActivityIndicator size="large" color="#007bff" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: "center",
    marginBottom: height * 0.1,
    borderRadius: 100,
  },
});
