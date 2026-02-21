import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SIZES, COLORS, icons } from "../../../constants";
import { useRouter } from "expo-router";
const Header = ({ title, route }: any) => {
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLORS.white,
        },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={icons.back}
          resizeMode="contain"
          style={[styles.backIcon]}
        />
      </TouchableOpacity>
      <Text style={[styles.title]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default Header;
