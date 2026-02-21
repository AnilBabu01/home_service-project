import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import ReasonItem from "./../components/ReasonItem";
import Button from "../components/Common/CustomButton";
import Header from "./../components/Header";
import { useBookingCancelMutation } from "@/lib/react-query/serverinstamce";
import { showToast } from "../utils/allFunctions";
import { useRouter, useLocalSearchParams } from "expo-router";


const CancelBooking = ({ navigation }: any) => {
  const router = useRouter();
  const { item, route } = useLocalSearchParams();
  const [BookingCancel, { isLoading }] = useBookingCancelMutation();
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const handleCancelBooking = async () => {
    try {
      const bookingId = JSON.parse(Array.isArray(item) ? item[0] : item)?.id;

      if(!comment)
        {
          showToast('Error!', 'Comment is required', 'danger')
          return;
        }
        if(!selectedItem)
        {
          showToast('Error!', 'Select item is required', 'danger')
          return;
        }
        
      console.log("body data is", {
        bookingId,
        comment,
        selectedItem,
      });

      const res = await BookingCancel({
        id: bookingId,
        body: { reason: comment, reasonDescription: selectedItem },
      }).unwrap();

      showToast("Success!", res?.msg, "success");
      router.push("/(drawer)/(tabs)");
    } catch (error: any) {
      showToast("Error!", error?.data?.msg, "danger");
    }
  };

  const renderContent = () => {
    const handleCheckboxPress = (itemTitle: any) => {
      if (selectedItem === itemTitle) {
        setSelectedItem(null);
      } else {
        setSelectedItem(itemTitle);
      }
    };

    const handleCommentChange = (text: any) => {
      setComment(text);
    };

    console.log("item", JSON.parse(item).id);

    return (
      <View style={{ marginVertical: 12 }}>
        <Text
          style={[
            styles.inputLabel,
            {
              color: COLORS.greyscale900,
            },
          ]}
        >
          Please select the reason for the cancellations
        </Text>
        <View style={{ marginVertical: 16 }}>
          <ReasonItem
            checked={selectedItem === "Schedule change"} // Check if it's the selected item
            onPress={() => handleCheckboxPress("Schedule change")} // Pass the item title
            title="Schedule change"
          />
          <ReasonItem
            checked={selectedItem === "Weather conditions"}
            onPress={() => handleCheckboxPress("Weather conditions")}
            title="Weather conditions"
          />
          <ReasonItem
            checked={selectedItem === "Unexpected Work"}
            onPress={() => handleCheckboxPress("Unexpected Work")}
            title="Unexpected Work"
          />
          <ReasonItem
            checked={selectedItem === "Childcare Issue"}
            onPress={() => handleCheckboxPress("Childcare Issue")}
            title="Childcare Issue"
          />
          <ReasonItem
            checked={selectedItem === "Travel Delays"}
            onPress={() => handleCheckboxPress("Travel Delays")}
            title="Travel Delays"
          />
          <ReasonItem
            checked={selectedItem === "Others"}
            onPress={() => handleCheckboxPress("Others")}
            title="Others"
          />
        </View>
        <Text
          style={[
            styles.inputLabel,
            {
              color: COLORS.greyscale900,
            },
          ]}
        >
          Add detailed reason
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: COLORS.greyscale900,
              borderColor: COLORS.greyscale900,
            },
          ]}
          placeholder="Write your reason here..."
          placeholderTextColor={COLORS.greyscale900}
          multiline={true}
          onChangeText={(text) => handleCommentChange(text)}
          numberOfLines={4} // Set the number of lines you want to display initially
        />
      </View>
    );
  };

  /**
   * Render submit buttons
   */
  const renderSubmitButton = () => {
    return (
      <View style={[styles.btnContainer]}>
        <Button
          title="Submit"
          isLoading={isLoading}
          style={styles.submitBtn}
          onPress={() => handleCancelBooking()}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area]}>
      <View style={[styles.container]}>
        <Header title="Cancel Booking" route={route} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>
      {renderSubmitButton()}
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
    padding: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
    alignItems: "center",
  },
  headerIcon: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: COLORS.gray,
  },
  arrowLeft: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  moreIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  input: {
    borderColor: "gray",
    borderWidth: 0.3,
    borderRadius: 5,
    width: "100%",
    padding: 10,
    paddingBottom: 10,
    fontSize: 12,
    height: 150,
    textAlignVertical: "top",
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
    marginBottom: 6,
    marginTop: 16,
  },
  btnContainer: {
    position: "absolute",
    bottom: 22,
    height: 72,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  btn: {
    height: 48,
    width: SIZES.width - 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  submitBtn: {
    width: SIZES.width - 32,
  },
  btnText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.white,
  },
});

export default CancelBooking;
