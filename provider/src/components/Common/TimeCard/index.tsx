import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { TimeSlotType } from "@/expo-env";
import { COLORS } from "@/constants";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";

type Props = {
  item: TimeSlotType;
};
export default function Index({ item }: Props) {
  return (
    <View style={[styles.container]}>
      <Text>{item?.slot}</Text>
      <View style={[styles.iconContainer]}>
        <Pressable style={[{ marginRight: 15 }]}>
          <FontAwesome5 name="edit" color={COLORS.greeen} size={20} />
        </Pressable>
        <Pressable>
          <FontAwesome5 name="trash" color={COLORS.red} size={20} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayscale100,
    marginBottom: 10,
    padding: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
  },
});
