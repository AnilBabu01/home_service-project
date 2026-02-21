import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { COLORS } from "@/constants";
import Request from "@/src/components/HomeTabs/Request";
import Complete from "@/src/components/HomeTabs/Complete";
import Cancelled from "@/src/components/HomeTabs/Cancelled";
import { useNavigation } from "expo-router";
import messaging from "@react-native-firebase/messaging";

const Index = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);

  const [routes] = useState([
    { key: "request", title: "Request" },
    { key: "complete", title: "Complete" },
    { key: "cancelled", title: "Cancelled" },
  ]);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "request":
        return <Request navigation={navigation} />;
      case "complete":
        return <Complete navigation={navigation} />;
      case "cancelled":
        return <Cancelled navigation={navigation} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async (remoteMessage: any) => {
        console.log(
          "App opened from background by notification:",
          remoteMessage
        );

        if (remoteMessage?.data?.roomId) {
          console.log("Room ID from background:", remoteMessage?.data?.roomId);
          setRoomId(remoteMessage?.data?.roomId);

          navigation.navigate("Chat", {
            item: JSON.stringify({ roomId: remoteMessage?.data?.roomId }),
            route: "/inbox",
          });
        }
      }
    );

    return unsubscribe;
  }, []);

  console.log("roomId  form index", roomId);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{
            backgroundColor: COLORS.primary,
          }}
          style={{
            backgroundColor: COLORS.white,
          }}
          activeColor={COLORS.primary}
          inactiveColor={COLORS.gray}
        />
      )}
    />
  );
};

export default Index;
