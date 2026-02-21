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
import CustomTextInput from "@/src/components/Form/CustomTextInput";
import CommonMultilineInput from "@/src/components/Form/CommonMultilineInput";
import DatePickerModal from "@/src/components/Form/DatePickerModal";
import {
  useGetProfileQuery,
  useEditPlanMutation,
} from "@/lib/react-query/serverinstamce";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "@/src/utils/allFunctions";
import { FontAwesome } from "@expo/vector-icons";
import { InputType, FormValues } from "@/expo-env";
import Header from "@/src/components/Common/Header/";

const PlanList = () => {
  const { data: isProfile } = useGetProfileQuery({});
  const [editplanList, { isSuccess, isError, isLoading }] =
    useEditPlanMutation();
  const [planList, setplanList] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [profile, setprofile] = useState<any>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      services: [{ keyName: "", amount: "", onDiscount: "" }],
    },
  });

  const onSubmit = async (data: any) => {
    const { services } = data;

    const formdata = {
      numberingKeys:JSON.stringify(services),
    };

    try {
      const res = await editplanList(formdata).unwrap();

      showToast(
        "Success!",
        res?.msg ?? "Plan list updated successfully",
        "success"
      );
    } catch (error: any) {
      console.error("Update error:", error);
      showToast("Error", "Failed to update plan list", "danger");
    }
  };

  const [numberingKeys, setNumberingKeys] = useState<InputType[]>([
    {keyName: "", amount: "", onDiscount: "" },
  ]);

  const handleInputChange = (index: number, field: string, value: string) => {
    setNumberingKeys((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addNewInputType = () => {
    setNumberingKeys((prev) => [
      ...prev,
      {
        keyName: "",
        amount: "",
        onDiscount: "",
        id: 0,
      },
    ]);
  };

  const removeInputType = (index: number) => {
    const updatedKeys = numberingKeys.filter((_, i) => i !== index);
    setNumberingKeys(updatedKeys);

    setValue("services", updatedKeys);

    updatedKeys.forEach((item, newIndex) => {
      setValue(`services.${newIndex}.keyName`, item.keyName);
      setValue(`services.${newIndex}.amount`, item.amount?.toString());
      setValue(`services.${newIndex}.onDiscount`, item.onDiscount?.toString());
      setValue(`services.${index}.id`, item.id);
    });
  };

  useEffect(() => {
    if (isProfile && isProfile.user) {
      setprofile(isProfile.user);

      if (isProfile.user.providerNumbering?.length > 0) {
        setNumberingKeys(isProfile.user.providerNumbering);

        isProfile.user.providerNumbering.forEach(
          (item: InputType, index: number) => {
            setValue(`services.${index}.keyName`, item.keyName);
            setValue(`services.${index}.amount`, item.amount?.toString());
            setValue(
              `services.${index}.onDiscount`,
              item.onDiscount?.toString()
            );
            setValue(`services.${index}.id`, item.id);
          }
        );
      } else {
        setNumberingKeys([{  keyName: "", amount: "", onDiscount: "" }]);
      }
    }
  }, [isProfile, setValue]);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <Header title="Plan list" redirectRoute="/" />
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View style={[styles.planHeader]}>
              <Text style={[styles.label]}>Plan list</Text>
              <Pressable onPress={() => addNewInputType()}>
                <FontAwesome name="plus" size={24} color={COLORS.primary} />
              </Pressable>
            </View>
            <View>
              {numberingKeys.map((item, index) => (
                <View key={index} style={[styles.itemContainer]}>
                  <Controller
                    control={control}
                    name={`services.${index}.keyName`}
                    rules={{ required: "Plan name is required" }}
                    render={({ field: { onChange, value } }) => (
                      <CustomTextInput
                        placeholder="Enter plan name"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          handleInputChange(index, "keyName", text);
                        }}
                        errorMessage={
                          errors?.services?.[index]?.keyName?.message
                        }
                        label="Name"
                      />
                    )}
                  />
                  <View style={[styles.rowAmount]}>
                    <View style={{ width: "48%" }}>
                      <Controller
                        control={control}
                        name={`services.${index}.amount`}
                        rules={{ required: "Amount is required" }}
                        render={({ field: { onChange, value } }) => (
                          <CustomTextInput
                            placeholder="Enter amount"
                            value={value}
                            onChangeText={(text) => {
                              onChange(text);
                              handleInputChange(index, "amount", text);
                            }}
                            errorMessage={
                              errors?.services?.[index]?.amount?.message
                            }
                            label="Amount"
                            keyboardType="numeric"
                          />
                        )}
                      />
                    </View>
                    <View style={{ width: "48%" }}>
                      <Controller
                        control={control}
                        name={`services.${index}.onDiscount`}
                        rules={{ required: "Discount is required" }}
                        render={({ field: { onChange, value } }) => (
                          <CustomTextInput
                            placeholder="Enter discount"
                            value={value}
                            onChangeText={(text) => {
                              onChange(text);
                              handleInputChange(index, "onDiscount", text);
                            }}
                            errorMessage={
                              errors?.services?.[index]?.onDiscount?.message
                            }
                            label="On Discount"
                            keyboardType="numeric"
                          />
                        )}
                      />
                    </View>
                  </View>

                  {index > 0 && (
                    <Pressable
                      style={[styles.removeBtn]}
                      onPress={() => removeInputType(index)}
                    >
                      <FontAwesome
                        name="minus"
                        size={24}
                        color={COLORS.primary}
                      />
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
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

export default PlanList;

const styles = StyleSheet.create({
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
