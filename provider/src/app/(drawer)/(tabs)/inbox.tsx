import { View, StyleSheet } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Chats from "@/src/components/Chat/Chats";

const Inbox = () => {
  return (
    <SafeAreaView style={[styles.area]}>
      <View style={[styles.container]}>
        <Chats />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    height: 36,
    width: 36,
    // tintColor: COLORS.primary
    borderRadius: 100,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12,
  },
  addPostBtn: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    position: "absolute",
    bottom: 72,
    right: 16,
    zIndex: 999,
    shadowRadius: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
  },
});

export default Inbox;
