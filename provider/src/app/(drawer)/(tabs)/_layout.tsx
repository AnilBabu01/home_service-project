import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, icons } from "@/constants";
import { Image } from "react-native";

const _layout = () => {
  

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={focused ? icons.home : icons.home2Outline}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? COLORS.primary : COLORS.gray3,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Service",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "location" : "location-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "inbox",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={focused ? icons.chatBubble2 : icons.chatBubble2Outline}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? COLORS.primary : COLORS.gray3,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={focused ? icons.user : icons.userOutline}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? COLORS.primary : COLORS.gray3,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
