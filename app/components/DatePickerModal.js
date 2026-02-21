import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { COLORS } from '../constants'; // Make sure COLORS is defined

const { width, height } = Dimensions.get('window');

const DatePickerModal = ({
  open,
  startDate,
  selectedDate,
  onClose,
  onChangeStartDate,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(selectedDate);

  // Format from yyyy/mm/dd to dd/mm/yyyy
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('/');
    return `${day}/${month}/${year}`;
  };

  // Format from dd/mm/yyyy to yyyy/mm/dd for picker compatibility
  const reformatToPickerDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}/${month}/${day}`;
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setSelectedStartDate(formattedDate);
    onChangeStartDate(formattedDate);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DatePicker
            mode="calendar"
            minimumDate={startDate}
            selected={reformatToPickerDate(selectedStartDate)}
            onDateChange={handleDateChange}
            options={{
              backgroundColor: COLORS.primary,
              textHeaderColor: COLORS.white,
              textDefaultColor: '#FFFFFF',
              selectedTextColor: COLORS.primary,
              mainColor: COLORS.white,
              textSecondaryColor: '#FFFFFF',
              borderColor: COLORS.primary,
            }}
            style={{ width: width * 0.85 }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  closeText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DatePickerModal;
