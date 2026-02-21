import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import CustomButton from "../components/Common/CustomButton";
import CustomTextInput from "../components/Form/CustomTextInput";
import { width, height } from "../utils/responsuve";
import { icons } from "../../constants";
import {
  useLoginMutation,
  useGetProfileQuery,
} from "@/lib/react-query/serverinstamce";
import { showToast } from "../utils/allFunctions";
import messaging from "@react-native-firebase/messaging";

export default function Index() {
  const router = useRouter();
  const { data, isLoading: profileLoading } = useGetProfileQuery([]);
  const [login, { isLoading }] = useLoginMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (data) {
      router.replace("/(drawer)/(tabs)");
    }
  }, [data]);

  if (profileLoading || data) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const onSubmit = async (formData: any) => {
    try {
      const { email, password } = formData;

      const token = await messaging().getToken();

      const data = {
        notification_token: token,
        email: email,
        password: password,
      };

      const res = await login(data).unwrap();
      showToast("Success!", res?.msg, "success");
      router.replace("/(drawer)/(tabs)");
    } catch (error: any) {
      showToast("Error!", error?.data?.msg, "danger");

      console.log("formData  is formData", formData);
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <Image
          source={require("../../assets/images/nowLogo.png")}
          style={styles.logo}
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
              placeholder="Enter email"
              value={value}
              onChangeText={onChange}
              errorMessage={errors.email?.message as string | undefined}
              icon={icons.email}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomTextInput
              placeholder="Enter password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              errorMessage={errors.password?.message as string | undefined}
              icon={icons.padlock}
            />
          )}
        />

        <CustomButton
          title="Login"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  formContainer: {
    width: width * 0.9,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: "center",
    marginBottom: height * 0.1,
    borderRadius: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
