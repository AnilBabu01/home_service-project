import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons, COLORS, SIZES } from "@/constants";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDate } from "../utils/allFunctions";
import * as Clipboard from "expo-clipboard";

export default function EReceipt() {
  const router = useRouter();
  const { isBooking } = useLocalSearchParams();
  const bookingString = Array.isArray(isBooking) ? isBooking[0] : isBooking;
  const bookingData = bookingString ? JSON.parse(bookingString) : null;

  console.log("isBooking",bookingData?.service?.provider);

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.arrowBack}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: COLORS.black,
                },
              ]}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                color: COLORS.black,
              },
            ]}
          >
            E-Receipt
          </Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode="contain"
            style={[
              styles.moreIcon,
              {
                tintColor: COLORS.black,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    const handleCopyToClipboard = async () => {
      await Clipboard.setStringAsync(bookingData?.transactionId);
      Alert.alert("Copied!", "Transaction ID copied to clipboard.");
    };

    return (
      <View style={{ marginVertical: 22 }}>
        {/* <Barcode
          format="EAN13"
          value={bookingData?.transactionId}
          text={bookingData?.transactionId}
          width={SIZES.width - 64}
          height={72}
          style={{
            marginBottom: 40,
            backgroundColor: COLORS.white,
          }}
          lineColor={COLORS.black}
          textStyle={{
            color: COLORS.black,
          }}
          maxWidth={SIZES.width - 64}
        /> */}

        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Services</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {bookingData?.service?.name}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Category</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {bookingData?.service?.category?.name}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Workers</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {bookingData?.service?.provider?.name}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Date & Time</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {bookingData?.date?.split("").reverse().join("")} |{" "}
              {bookingData?.time}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Name</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {bookingData?.service?.provider?.name}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Phone</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              +1 111 3452 2837 3747
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Email</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {bookingData?.service?.provider?.email}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Country</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              United States
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Price</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              ₹{bookingData?.totalAmount}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Payment Methods</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {bookingData?.paymentMethod}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Date</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {formatDate(bookingData?.createdAt)}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Transaction ID</Text>
            <View style={styles.copyContentContainer}>
              <Text style={styles.viewRight}>{bookingData.transactionId}</Text>
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={handleCopyToClipboard}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Status</Text>
            <TouchableOpacity style={styles.statusBtn}>
              <Text style={styles.statusBtnText}>Paid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
        <View style={[styles.container, { backgroundColor: COLORS.white }]}>
          {renderHeader()}
          <ScrollView
            style={[
              styles.scrollView,
              {
                backgroundColor: COLORS.tertiaryWhite,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

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
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  scrollView: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  summaryContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 12,
  },
  viewLeft: {
    fontSize: 12,
    fontFamily: "regular",
    color: "gray",
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
  },
  copyContentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBtn: {
    width: 72,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 6,
  },
  statusBtnText: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
});
