import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS, SIZES, images } from "@/constants";
import CustomButton from "@/src/components/Common/CustomButton";
import CustomTextInput from "@/src/components/Form/CustomTextInput";
import CommonMultilineInput from "@/src/components/Form/CommonMultilineInput";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { launchImagePicker } from "@/src/components/Form/launchImagePicker";
import {
  useGetProfileQuery,
  useEditServiceMutation,
} from "@/lib/react-query/serverinstamce";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "@/src/utils/allFunctions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { width, height } from "@/src/utils/responsuve";
import { getLocation } from "@/src/components/PushNotification";
import { GOOGLE_MAPS_API_KEY } from "@/src/utils/config";
const Account = () => {
  const { data: isProfile } = useGetProfileQuery({});
  const [editservice, { isSuccess, isError, isLoading }] =
    useEditServiceMutation();
  const [planList, setplanList] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [profile, setprofile] = useState<any>();
  const [locationLoading, setlocationLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      hoursPrice: "",
    },
  });

  const [userLocation, setUserLocation] = useState<any>(null);

  const handleGetLocation = async () => {
    const location = await getLocation();
    setlocationLoading(true);
    if (location) {
      setUserLocation(location.coords);
      showToast("Success!", "Your location detected successfully", "success");

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data?.results?.length > 0) {
        setValue("address", data.results[0]?.formatted_address);
        showToast("Success!", "Address detected successfully", "success");
        setlocationLoading(false);
      } else {
        showToast("Error", "Unable to fetch address", "danger");
        setlocationLoading(false);
      }
    }
  };

  const onSubmit = async (formData: any) => {
    const { name, description, address, hoursPrice } = formData;

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("address", address);
    formdata.append("hoursPrice", hoursPrice);
    formdata.append("latitude", userLocation?.latitude);
    formdata.append("longitude", userLocation?.longitude);

    if (image) {
      const response = await fetch(image.uri);
      const blob = await response.blob();

      formdata.append("profile", {
        uri: image.uri,
        type: "image/jpeg",
        name: "upload.jpg",
      });
    }

    try {
      const res = await editservice(formdata).unwrap();

      showToast(
        "Success!",
        res?.msg ?? "Service updated successfully",
        "success"
      );
    } catch (error: any) {
      console.error("Update error:", error);
      showToast("Error", "Failed to update service", "danger");
    }
  };

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      setImage({ uri: tempUri });
    } catch (error) {}
  };

  useEffect(() => {
    if (isProfile) {
      setValue("name", isProfile?.user?.services[0]?.name || "");
      setValue("description", isProfile?.user?.services[0]?.description || "");
      setValue("address", isProfile?.user?.services[0]?.address || "");
      setValue(
        "hoursPrice",
        isProfile?.user?.services[0]?.hoursPrice?.toString() || ""
      );
      setprofile(isProfile?.user);
      setplanList(isProfile?.user?.providerNumbering);
    }
  }, [isProfile]);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  image
                    ? { uri: image.uri }
                    : profile?.services[0]?.image
                    ? { uri: profile?.services[0]?.image }
                    : images.default10
                }
                resizeMode="cover"
                style={styles.avatar}
              />

              <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Controller
              control={control}
              name="hoursPrice"
              rules={{
                required: "Hours amount name is required",
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  placeholder="Enter Hours amount"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={
                    errors.hoursPrice?.message as string | undefined
                  }
                  label="Hours amount"
                />
              )}
            />

            <Controller
              control={control}
              name="name"
              rules={{
                required: "Service name is required",
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  placeholder="Enter service"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message as string | undefined}
                  label="Service"
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              rules={{}}
              render={({ field: { onChange, value } }) => (
                <CommonMultilineInput
                  placeholder="Enter description"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={
                    errors.description?.message as string | undefined
                  }
                  label="Description"
                />
              )}
            />

            <Controller
              control={control}
              name="address"
              rules={{}}
              render={({ field: { onChange, value } }) => (
                <CommonMultilineInput
                  placeholder="Enter address"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.address?.message as string | undefined}
                  label="Address"
                />
              )}
            />
            <Pressable
              onPress={() => handleGetLocation()}
              style={styles.getLocationContainer}
            >
              <Ionicons name="location-outline" size={25} />
              {locationLoading && (
                <ActivityIndicator size={20} color={COLORS.primary} />
              )}
              <Text style={styles.locationText}>Detect my Location</Text>
            </Pressable>
          </View>
        </ScrollView>

        <CustomButton
          title="Update"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
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
  getLocationContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.brColor,
    borderStyle: "dotted",
    borderRadius: 15,
    marginBottom: width * 0.04,
    paddingVertical: width * 0.06,
    backgroundColor: COLORS.white,
  },
  locationText: {
    color: "#3B3B3B",
    fontWeight: "600",
  },
});
