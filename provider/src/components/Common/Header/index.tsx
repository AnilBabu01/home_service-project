import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { COLORS, icons, SIZES } from "@/constants";
import { useRouter } from "expo-router";

type Props = {
  title?: string;
  redirectRoute?: string;
};

export default function Index({ title, redirectRoute }: Props) {
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => router.replace(redirectRoute as any)}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={[
              styles.backIcon,
              {
                tintColor: COLORS.white,
              },
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            {
              color: COLORS.white,
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width,
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginLeft: 16,
  },
});
