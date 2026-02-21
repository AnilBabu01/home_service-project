import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { COLORS, SIZES, images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Common/CustomButton";
import Header from "./../components/Header";
import {
  useBookingCompleteMutation,
  useBookingCancelMutation,
} from "@/lib/react-query/serverinstamce";
import { showToast } from "../utils/allFunctions";
import { useRouter, useLocalSearchParams } from "expo-router";
import { width } from "../utils/responsuve";
import Rating from "../components/Rating/Rating";
import { useNavigation } from "expo-router";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomButton from "../components/Common/CustomButton";

const BookingDetails = () => {
  const navigate = useNavigation();
  const router = useRouter();
  const refRBSheet = useRef<any | null>(null);
  const { item, route } = useLocalSearchParams();
  const [BookingComplete, { isLoading }] = useBookingCompleteMutation();
  const [BookingCancel, { isLoading: isCancelling }] =
    useBookingCancelMutation();
  const [IsData, setIsData] = useState<any>("");
  const [rating, setRating] = useState(3);
  const [selectedItem, setselectedItem] = useState<any>("");

  useEffect(() => {
    if (item) {
      try {
        const itemString = Array.isArray(item) ? item[0] : item;
        setIsData(JSON.parse(itemString));
      } catch (error) {
        console.error("Error parsing item:", error);
        setIsData({});
      }
    }
  }, [item]);

  const handleCompletBooking = async () => {
    try {
      const res = await BookingComplete(IsData?.id).unwrap(); // Pass id directly

      showToast("Success!", res?.msg, "success");
      router.push("/(drawer)/(tabs)");
    } catch (error: any) {
      showToast("Error!", error?.data?.msg, "danger");
      console.log("booking is",error)
    }
  };

  console.log("IsData?.id  ",IsData?.id)

  return (
    <SafeAreaView style={[styles.area]}>
      <View style={[styles.container]}>
        <Header title="Booking Details" route={route} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={
                IsData?.service?.provider?.profile
                  ? { uri: IsData?.service?.provider?.profile }
                  : images.default10
              }
              style={styles.profile}
            />
            <View style={styles.ratingContainer}>
              <Text style={[styles.nameText]}>
                {IsData?.service?.provider?.name ?? "N/A"}
              </Text>

              <Rating
                color={COLORS.primary}
                rating={rating}
                setRating={setRating}
                size={16}
              />

              <View>
                <Button
                  title="Message"
                  style={styles.messageBtn}
                  textStyle={{ fontSize: 9 }}
                  onPress={() => {
                    navigate.navigate("Chat", {
                      item: item,
                    });
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.taskConatiner}>
            <Text style={styles.title}>Task details</Text>
            <View style={styles.tableHeader}>
              <View style={{ width: "50%" }}>
                <Text style={styles.hdText}>Task</Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text style={styles.hdText}>Quantity</Text>
              </View>
            </View>
            {IsData?.serviceBookingNumberings?.map(
              (item: any, index: number) => {
                return (
                  <View key={index}>
                    {item?.count! && (
                      <View style={styles.tableValue}>
                        <View style={{ width: "50%" }}>
                          <Text style={styles.vText}>
                            {item?.providerNumbering?.keyName}
                          </Text>
                        </View>
                        <View style={{ width: "50%" }}>
                          <Text style={styles.vText}>{item?.count}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              }
            )}
          </View>
          <View style={styles.taskConatiner}>
            <Text style={styles.title}>Payment details</Text>
            <View style={styles.paymentHeader}>
              <View style={{ width: "50%" }}>
                <Text style={styles.paymentText}>Total payment</Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text style={styles.paymentItemText}>₹ {IsData?.amount}</Text>
              </View>
            </View>
            <View style={styles.paymentHeader}>
              <View style={{ width: "50%" }}>
                <Text style={styles.paymentText}>Advance payment</Text>
              </View>
              <View style={styles.btnpaiContainer}>
                <Text style={styles.paymentItemText}>
                  ₹ {IsData.advanceAmount}
                </Text>{" "}
                <View style={styles.paidBtn}>
                  <Text style={styles.btnIocnText}>Paid</Text>
                </View>
              </View>
            </View>
            <View style={styles.paymentHeader}>
              <View style={{ width: "50%" }}>
                <Text style={styles.paymentText}>Remaining payment</Text>
              </View>
              <View style={styles.btnpaiContainer}>
                <Text style={styles.paymentItemText}>
                  ₹ {IsData?.totalAmount - IsData.advanceAmount}
                </Text>{" "}
                <View style={styles.pendingBtn}>
                  <Text style={styles.btnIocnText}>Pending</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigate.navigate("EReceipt", {
                  isBooking: item,
                  route: "BookingDetails",
                });
              }}
              style={styles.receiptBtn}
            >
              <Text style={styles.receiptBtnText}>E-Receipt</Text>
            </TouchableOpacity>
          </View>

          <View style={[{ marginBottom: width * 0.09 }]}>
            <Text style={styles.title}>Address details</Text>
            <Text style={styles.addresstext}>{IsData?.address}</Text>
          </View>
        </ScrollView>
      </View>
      <View style={[styles.btnContainer]}>
        <Button
          title="Cancel"
          isLoading={isCancelling}
          style={styles.submitBtn}
          textStyle={{ fontSize: 13 }}
          onPress={() => {
            refRBSheet.current.open();
            setselectedItem(item);
          }}
        />
        <Button
          title="View route"
          style={styles.submitBtn}
          textStyle={{ fontSize: 13 }}
          onPress={() => {
            navigate.navigate("LiveMap", {
              isBooking: item,
            });
          }}
        />

        <Button
          title="Complete"
          isLoading={isLoading}
          style={styles.submitBtn}
          textStyle={{ fontSize: 13 }}
          onPress={() => handleCompletBooking()}
        />
      </View>

      <RBSheet
        ref={refRBSheet}
        // dragFromTopOnly={true} // Alternative for closeOnDragDown
        closeOnPressBack={false} // Alternative for closeOnPressMask
        height={332}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: COLORS.greyscale300,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 332,
            backgroundColor: COLORS.white,
            alignItems: "center",
            width: "100%",
          },
        }}
      >
        <Text
          style={[
            styles.bottomSubtitle,
            {
              color: COLORS.red,
            },
          ]}
        >
          Cancel Booking
        </Text>
        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: COLORS.grayscale200,
            },
          ]}
        />

        <View style={styles.selectedCancelContainer}>
          <Text
            style={[
              styles.cancelTitle,
              {
                color: COLORS.greyscale900,
              },
            ]}
          >
            Are you sure you want to cancel your apartment booking?
          </Text>
          <Text
            style={[
              styles.cancelSubtitle,
              {
                color: COLORS.grayscale700,
              },
            ]}
          >
            Only 80% of the money you can refund from your payment according to
            our policy.
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <CustomButton
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: COLORS.white,
              borderRadius: 32,
              borderWidth: 1,
              borderColor: COLORS.primary,
            }}
            textStyle={{ color: COLORS.primary }}
            onPress={() => refRBSheet.current.close()}
          />
          <CustomButton
            title="Yes, Cancel"
            style={styles.removeButton}
            onPress={() => {
              navigate.navigate("CancelBooking", {
                item: selectedItem,
                route: "/(drawer)/(tabs)",
              });
            }}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cancelSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 8,
    marginTop: 16,
  },
  cancelTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
  },
  selectedCancelContainer: {
    marginVertical: 24,
    paddingHorizontal: 36,
    width: "100%",
  },
  separateLine: {
    width: "100%",
    height: 0.7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12,
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12,
  },
  addresstext: {
    marginTop: width * 0.01,
  },
  btnpaiContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  btnIocnText: {
    color: COLORS.white,
    fontSize: 11,
  },
  pendingBtn: {
    backgroundColor: COLORS.orange,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.02,
    marginLeft: width * 0.03,
  },
  paidBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.03,
    marginLeft: width * 0.03,
  },
  receiptBtn: {
    width: "100%",
    height: 36,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12,
  },
  receiptBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.white,
  },
  hdText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "600",
  },
  vText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "600",
  },
  paymentText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "600",
  },
  paymentItemText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: "600",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: width * 0.02,
    borderTopWidth: 1,
    borderTopColor: "#335EF780",
    borderBottomWidth: 1,
    borderBottomColor: "#335EF780",
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.02,
  },
  paymentHeader: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.02,
  },
  tableValue: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: width * 0.02,
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.02,
  },
  taskConatiner: {
    marginTop: width * 0.08,
  },
  title: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  ratingContainer: {
    flex: 1,
    marginLeft: width * 0.03,
    marginTop: width * 0.02,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.03,
  },
  profile: {
    width: width / 5,
    height: width / 5,
    resizeMode: "contain",
    borderRadius: 100,
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
    width: "100%",
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
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: "30%",
    paddingHorizontal: 0,
    height: width / 8,
  },
  messageBtn: {
    width: "50%",
    paddingHorizontal: 0,
    height: width / 10,
    marginTop: width * 0.02,
  },
  btnText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.white,
  },
  nameText: {
    color: COLORS.black,
    fontWeight: "700",
    fontSize: 16,
  },
});

export default BookingDetails;
