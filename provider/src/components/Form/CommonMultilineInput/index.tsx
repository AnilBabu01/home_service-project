import React, { useState } from "react";
import { TextInput, StyleSheet, TextInputProps, View ,Text} from "react-native";
import { COLORS } from "@/constants";

interface Props extends TextInputProps {
  placeholder?: string;
  label?: string;
  errorMessage?: string;
}

const Index: React.FC<Props> = ({ placeholder,  label,errorMessage, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

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
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          {...rest}
        />
          {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    minHeight: 100, // Adjusted height to fit multiple lines
    alignItems: "flex-start", // Ensure alignment works with multiline input
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top", 
    minHeight: 100,
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default Index;
