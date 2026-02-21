import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS, SIZES, icons, images } from "@/constants";
import CustomButton from "@/src/components/Common/CustomButton";
import DatePickerModal from "@/src/components/Form/DatePickerModal";
import {
  useGetProfileQuery,
  useEditTimeSlotMutation,
} from "@/lib/react-query/serverinstamce";
import { showToast } from "@/src/utils/allFunctions";
import { FontAwesome } from "@expo/vector-icons";
import { InputType, FormValues, TimeSlotType } from "@/expo-env";
import Header from "@/src/components/Common/Header/";
import TimeCard from "@/src/components/Common/TimeCard";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";


const TimeSlot = () => {
  const [edittimeSlot, { isSuccess, isError, isLoading }] =
    useEditTimeSlotMutation();
  const { data: isProfile } = useGetProfileQuery({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [numberingKeys, setNumberingKeys] = useState<TimeSlotType[]>([]);

  const handleDelete = (index: number) => {
    setNumberingKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  const handleTimeChange = (date: string) => {
    const selectedTime = date?.toString();

    const isDuplicate = numberingKeys.some((item, index) => {
      if (selectedIndex !== null && index === selectedIndex) return false;
      return item.slot === selectedTime;
    });

    if (isDuplicate) {
      showToast("Error", "This time slot already exists", "danger");
      return;
    }

    if (selectedIndex !== null) {
      setNumberingKeys((prev) =>
        prev.map((item, i) =>
          i === selectedIndex ? { ...item, slot: selectedTime } : item
        )
      );
    } else {
      setNumberingKeys((prev) => [
        ...prev,
        {
          id: prev.length,
          slot: selectedTime,
          provider_id: 0,
          isAvailable: true,
        },
      ]);
    }

    setSelectedIndex(null);
  };

  const onSubmit = async () => {
    const formdata = {
      numberingKeys: JSON.stringify(numberingKeys),
    };

    console.log("df", formdata);

    try {
      const res = await edittimeSlot(formdata).unwrap();
      showToast(
        "Success!",
        res?.msg ?? "Time slot updated successfully",
        "success"
      );
    } catch (error: any) {
      console.error("Update error:", error);
      showToast("Error", "Failed to update time slot", "danger");
    }
  };

  useEffect(() => {
    if (isProfile && isProfile.user) {
      if (isProfile.user.providerTimeSlot?.length > 0) {
        setNumberingKeys(isProfile.user.providerTimeSlot);
      } else {
      }
    }
  }, [isProfile]);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <Header title="Time Slot" redirectRoute="/" />
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[{ marginBottom: 5 }]}>
            <View style={[styles.planHeader]}>
              <Text style={[styles.label]}>Time slot list</Text>
              <Pressable onPress={() => setIsOpen(true)}>
                <FontAwesome name="plus" size={24} color={COLORS.primary} />
              </Pressable>
            </View>
          </View>
          <View>
            {numberingKeys?.map((item: TimeSlotType, index: number) => {
              return (
                <View style={[styles.timeSlotContainer]} key={index}>
                  <Text>{item?.slot}</Text>
                  <View style={[styles.iconContainer]}>
                    <Pressable
                      style={[{ marginRight: 15 }]}
                      onPress={() => handleEdit(index)}
                    >
                      <FontAwesome5
                        name="edit"
                        color={COLORS.green}
                        size={20}
                      />
                    </Pressable>
                    <Pressable onPress={() => handleDelete(index)}>
                      <FontAwesome5 name="trash" color={COLORS.red} size={20} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <CustomButton
          title="Update"
          onPress={() => onSubmit()}
          isLoading={isLoading}
        />

        <DatePickerModal
          open={isOpen}
          mode="time"
          onClose={() => setIsOpen(false)}
          onChangeStartDate={handleTimeChange}
        />
      </View>
    </SafeAreaView>
  );
};

export default TimeSlot;

const styles = StyleSheet.create({
  timeSlotContainer: {
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
  rowAmount: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemContainer: {
    position: "relative",
  },
  removeBtn: {
    position: "absolute",
    left: "90%",
  },
  planHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "bold",
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    marginBottom: 12,
    alignItems: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 6,
    height: 52,
    width: SIZES.width - 32,
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  },
  downIcon: {
    width: 10,
    height: 10,
    tintColor: "#111",
  },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  flagIcon: {
    width: 30,
    height: 30,
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,
    color: "#111",
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 6,
    height: 58,
    width: SIZES.width - 32,
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  },
});
