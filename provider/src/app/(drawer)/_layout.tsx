import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useRouter, usePathname } from "expo-router";
import {
  useGetProfileQuery,
  useLogoutMutation,
} from "@/lib/react-query/serverinstamce";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { COLORS } from "@/constants";
import { useNavigation } from "@react-navigation/native";
import { useGetNotificationQuery } from "@/lib/react-query/serverinstamce";
export default function DrawerRoot() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const {
    data: notification,
    isLoading: notificationIsLoading,
    refetch,
  } = useGetNotificationQuery({});

  const unseenCount = notification?.pagination?.unseenCount || 0;

  console.log("notificationsdrawe from ", unseenCount);

  const { data, isLoading } = useGetProfileQuery({});
  const [logOut] = useLogoutMutation();
  useEffect(() => {
    if (!isLoading && !data) {
      router.replace("/");
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </GestureHandlerRootView>
    );
  }

  const handleLogout = async () => {
    console.log("Logout clicked");
    await logOut();
    router.replace("/login");
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer
        screenOptions={{
          drawerStyle: styles.drawerStyle,
        }}
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            <View style={styles.profileContainer}>
              <Image
                source={
                  data?.user?.profile
                    ? { uri: data?.user?.profile }
                    : require("../../../assets/images/defaultUser.png")
                }
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{data?.user?.name}</Text>
              <Text style={styles.userEmail}>{data?.user?.email}</Text>
            </View>
            <View style={styles.drawerItemsContainer}>
              <DrawerItem
                label="Home"
                icon={({ color, size }) => (
                  <Ionicons
                    name="home"
                    color={isActive("/") ? "white" : color}
                    size={size}
                  />
                )}
                onPress={() => router.push("/")}
                style={[
                  styles.drawerItem,
                  isActive("/") && styles.activeDrawerItem,
                ]}
                labelStyle={isActive("/") ? styles.activeLabel : {}}
              />
              <DrawerItem
                label="Account"
                icon={({ color, size }) => (
                  <Ionicons
                    name="reader"
                    color={isActive("/account") ? "white" : color}
                    size={size}
                  />
                )}
                onPress={() => router.push("/account")}
                style={[
                  styles.drawerItem,
                  isActive("/account") && styles.activeDrawerItem, // Apply active style
                ]}
                labelStyle={isActive("/account") ? styles.activeLabel : {}}
              />
              <DrawerItem
                label="Profile"
                icon={({ color, size }) => (
                  <Ionicons
                    name="person"
                    color={isActive("/profile") ? "white" : color}
                    size={size}
                  />
                )}
                onPress={() => router.push("/profile")}
                style={[
                  styles.drawerItem,
                  isActive("/profile") && styles.activeDrawerItem,
                ]}
                labelStyle={isActive("/profile") ? styles.activeLabel : {}}
              />

              <DrawerItem
                label="Plan List"
                icon={({ color, size }) => (
                  <FontAwesome5
                    name="rupee-sign"
                    color={isActive("/planlist") ? "white" : color}
                    size={size}
                  />
                )}
                onPress={() => router.push("/planlist")}
                style={[
                  styles.drawerItem,
                  isActive("/planlist") && styles.activeDrawerItem,
                ]}
                labelStyle={isActive("/planlist") ? styles.activeLabel : {}}
              />
              <DrawerItem
                label="Time  Slot"
                icon={({ color, size }) => (
                  <FontAwesome5
                    name="clock"
                    color={isActive("/timeslot") ? "white" : color}
                    size={size}
                  />
                )}
                onPress={() => router.push("/timeslot")}
                style={[
                  styles.drawerItem,
                  isActive("/timeslot") && styles.activeDrawerItem,
                ]}
                labelStyle={isActive("/timeslot") ? styles.activeLabel : {}}
              />

              <DrawerItem
                label="Logout"
                icon={({ color, size }) => (
                  <FontAwesome5 name="sign-out-alt" color={color} size={size} />
                )}
                onPress={handleLogout}
                style={styles.drawerItem}
              />
            </View>
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "AndamanHub",
            drawerLabel: "Home",
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: "#fff",
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="home" color={color} size={size} />
            ),

            headerRight: () => (
              <Pressable
                onPress={() => router.push("/notification")}
                style={{ marginRight: 15, position: "relative" }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />

                {unseenCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -2,
                      top: -2,
                      backgroundColor: "red",
                      borderRadius: 10,
                      width: 18,
                      height: 18,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {unseenCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerStyle: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    width: 250,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
  },
  drawerItemsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  drawerItem: {
    borderRadius: 8,
    marginVertical: 5,
  },
  activeDrawerItem: {
    backgroundColor: COLORS.primary,
  },
  activeLabel: {
    color: "white",
  },
});
