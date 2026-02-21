import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS, SIZES, images, icons } from "@/constants";
import CustomButton from "@/src/components/Common/CustomButton";
import CustomTextInput from "@/src/components/Form/CustomTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { launchImagePicker } from "@/src/components/Form/launchImagePicker";
import {
  useGetProfileQuery,
  useEditProfileMutation,
} from "@/lib/react-query/serverinstamce";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "@/src/utils/allFunctions";
import { getLocation } from "@/src/components/PushNotification";
import { useFocusEffect } from "@react-navigation/native";

const Profile = () => {
  const { data: isProfile } = useGetProfileQuery({});
  const [editprofile, { isSuccess, isError, isLoading }] =
    useEditProfileMutation();
  const [planList, setplanList] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [profile, setprofile] = useState<any>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      mobile_no: "",
      experience: "",
      password: "",
      latitude: "",
      longitude: "",
    },
  });

  const handleGetLocation = async () => {
    const location = await getLocation();

    if (location) {
      setValue("latitude", location.coords.latitude.toString());
      setValue("longitude", location.coords.longitude.toString());
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetLocation();
    }, [])
  );

  const onSubmit = async (formData: any) => {
    try {
      const {
        name,
        email,
        experience,
        mobile_no,
        password,
        latitude,
        longitude,
      } = formData;

      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("experience", experience);
      formdata.append("mobile_no", mobile_no);
      formdata.append("password", password);
      formdata.append("longitude", longitude);
      formdata.append("latitude", latitude);

      if (image) {
        const response = await fetch(image.uri);
        const blob = await response.blob();

        formdata.append("profile", {
          uri: image.uri,
          type: "image/jpeg",
          name: "upload.jpg",
        });
      }

      const res = await editprofile(formdata).unwrap();

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
      setValue("email", isProfile?.user?.email || "");
      setValue("name", isProfile?.user?.name || "");
      setValue("mobile_no", isProfile?.user?.mobile_no || "");
      setValue("experience", isProfile?.user?.experience || "");

      setprofile(isProfile?.user);
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
                    : profile?.profile
                    ? { uri: profile.profile }
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
              name="name"
              rules={{
                required: "name is required",
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Full name"
                  placeholder="Enter name"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message as string | undefined}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Email"
                  placeholder="Enter email"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message as string | undefined}
                />
              )}
            />
            <Controller
              control={control}
              name="mobile_no"
              rules={{
                required: "Mobile no is required",
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Mobile no"
                  placeholder="Enter mobile no"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.mobile_no?.message as string | undefined}
                 keyboardType="numeric"
                />
              )}
            />
            <Controller
              control={control}
              name="experience"
              rules={{
                required: "Experience is required",
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Experience"
                  placeholder="Enter experience"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={
                    errors.experience?.message as string | undefined
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Password"
                  placeholder="Enter password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message as string | undefined}
                  icon={icons.padlock}
                />
              )}
            />
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

export default Profile;

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
});
