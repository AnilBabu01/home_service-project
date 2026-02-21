import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, SIZES } from "@/constants";
import Header from "@/src/components/Common/Header/";
import { useGetNotificationQuery ,useSeenNotificationMutation} from "@/lib/react-query/serverinstamce";
import NotificationCard from "@/src/components/Common/NotificationCard";
import { getIconByType } from "@/data";

const Notification = () => {
  const { data, isLoading, refetch } = useGetNotificationQuery({});
  const [seenNotificaion] = useSeenNotificationMutation();
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setNotifications(data?.data);
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      seenNotificaion({}); 
    }, [refetch])
  );
  

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <Header title="Notification" redirectRoute="/" />
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <View style={styles.headerNoti}>
          <View style={styles.headerNotiLeft}>
            <Text
              style={[
                styles.notiTitle,
                {
                  color: COLORS.greyscale900,
                },
              ]}
            >
              Recent
            </Text>
            <View style={styles.headerNotiView}>
              <Text style={styles.headerNotiTitle}>
                {data?.pagination?.unseenCount}
              </Text>
            </View>
          </View>
        
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationCard
              title={item.title}
              description={item.message}
              icon={getIconByType(item?.type)}
              date={item?.createdAt}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },
  headerNoti: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  headerNotiLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  notiTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black,
  },
  headerNotiView: {
    height: 16,
    width: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  headerNotiTitle: {
    fontSize: 10,
    fontFamily: "bold",
    color: COLORS.white,
  },
  clearAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "medium",
  },
});
