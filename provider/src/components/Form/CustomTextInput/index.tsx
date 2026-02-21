import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

interface InputFieldProps extends TextInputProps {
  errorMessage?: string;
  icon?: ImageSourcePropType;
  label?: string;
}

const CustomTextInput = ({
  errorMessage,
  icon,
  secureTextEntry,
  label,
  style,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused ? COLORS.primary : "gray",
            backgroundColor: isFocused ? "#E0F7FA" : "white",
          },
        ]}
      >
        {icon && (
          <Image
            source={icon}
            style={[
              styles.icon,
              { tintColor: isFocused ? COLORS.primary : "#BCBCBC" },
            ]}
          />
        )}
        <TextInput
          style={[styles.input, style, errorMessage && styles.errorBorder]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: "row",
    minHeight: 52,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  icon: {
    marginRight: 10,
    height: 20,
    width: 20,
  },
  eyeIcon: {
    padding: 10,
  },
});

export default CustomTextInput;
