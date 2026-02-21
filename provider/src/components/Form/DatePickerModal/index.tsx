import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import { COLORS } from "../../../../constants";

interface DatePickerModalProps {
  open: boolean;
  selectedDate?: string;
  mode: "date" | "time" | "datetime";
  onClose: () => void;
  onChangeStartDate: (date: string) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  open,
  selectedDate,
  mode,
  onClose,
  onChangeStartDate,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  useEffect(() => {
    if (selectedDate) {
      setSelectedStartDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedStartDate(date);
  };

  const handleConfirm = () => {
    if (mode === "time") {
      const hours = selectedStartDate.getHours();
      const minutes = selectedStartDate.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

      onChangeStartDate(formattedTime);
    } else {
      onChangeStartDate(selectedStartDate.toISOString().split("T")[0]);
    }
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DatePicker
            mode={mode}
            date={selectedStartDate}
            onDateChange={handleDateChange}
            locale="en-US"
            is24hourSource="locale"
            theme="dark"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.confirmButton}
            >
              <Text style={{ color: "white" }}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ color: "black" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  confirmButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: COLORS.green,
    borderRadius: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
});

export default DatePickerModal;
