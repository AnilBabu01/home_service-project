import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import DatePicker from 'react-native-modern-datepicker'
import { COLORS, SIZES } from '../constants'

const DatePickerView = ({ startDate, selectedDate, onChangeStartDate }) => {
    const [internalSelectedDate, setInternalSelectedDate] =
        useState(selectedDate)

    useEffect(() => {
        setInternalSelectedDate(selectedDate)
    }, [selectedDate])

    const handleDateChange = (date) => {
        setInternalSelectedDate(date)
        onChangeStartDate(date)
    }

    return (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <DatePicker
                    mode="calendar"
                    minimumDate={startDate}
                    style={{
                        width: SIZES.width - 32,
                        borderRadius: 12,
                        paddingBottom: 0,
                    }}
                    selected={internalSelectedDate}
                    onDateChange={handleDateChange}
                    // onSelectedChange={(date) => setInternalSelectedDate(date)}
                    options={{
                        backgroundColor: COLORS.primary,
                        textHeaderColor: COLORS.white,
                        textDefaultColor: '#FFFFFF',
                        selectedTextColor: COLORS.primary,
                        mainColor: COLORS.white,
                        textSecondaryColor: '#FFFFFF',
                        borderColor: COLORS.primary,
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
    },
    modalView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default DatePickerView
