import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReasonItem from '../components/ReasonItem'
import Button from '../components/Button'
import Header from '../components/Header'
import { useTheme } from '../theme/ThemeProvider'
import { useBookingCancelMutation } from '../redux/serverinstance'
import { showToast } from '../utils/showToast'

const CancelBooking = ({ navigation, route }) => {
    const { colors, dark } = useTheme()
    const [BookingCancel, { isLoading }] = useBookingCancelMutation()
    const [comment, setComment] = useState('')
    const [selectedItem, setSelectedItem] = useState(null)

    const { item } = route.params

    const handleCancelBooking = async () => {
        try {
            const bookingId = item?.id

            if (!comment) {
                showToast('Error!', 'Comment is required', 'danger')
                return
            }
            if (!selectedItem) {
                showToast('Error!', 'Select item is required', 'danger')
                return
            }

            const res = await BookingCancel({
                id: bookingId,
                body: { reason: comment, reasonDescription: selectedItem },
            }).unwrap()

            showToast('Success!', res?.msg, 'success')
            navigation.goBack()
        } catch (error) {
            showToast('Error!', error?.data?.msg, 'danger')
        }
    }

    const handleCheckboxPress = (itemTitle) => {
        setSelectedItem((prev) => (prev === itemTitle ? null : itemTitle))
    }

    const handleCommentChange = (text) => {
        setComment(text)
    }

    const renderContent = () => (
        <View style={{ marginVertical: 12 }}>
            <Text
                style={[
                    styles.inputLabel,
                    {
                        color: dark ? COLORS.grayscale100 : COLORS.greyscale900,
                    },
                ]}
            >
                Please select the reason for the cancellations
            </Text>

            <View style={{ marginVertical: 16 }}>
                <ReasonItem
                    checked={selectedItem === 'Schedule change'} // Check if it's the selected item
                    onPress={() => handleCheckboxPress('Schedule change')} // Pass the item title
                    title="Schedule change"
                />
                <ReasonItem
                    checked={selectedItem === 'Weather conditions'}
                    onPress={() => handleCheckboxPress('Weather conditions')}
                    title="Weather conditions"
                />
                <ReasonItem
                    checked={selectedItem === 'Unexpected Work'}
                    onPress={() => handleCheckboxPress('Unexpected Work')}
                    title="Unexpected Work"
                />
                <ReasonItem
                    checked={selectedItem === 'Childcare Issue'}
                    onPress={() => handleCheckboxPress('Childcare Issue')}
                    title="Childcare Issue"
                />
                <ReasonItem
                    checked={selectedItem === 'Travel Delays'}
                    onPress={() => handleCheckboxPress('Travel Delays')}
                    title="Travel Delays"
                />
                <ReasonItem
                    checked={selectedItem === 'Others'}
                    onPress={() => handleCheckboxPress('Others')}
                    title="Others"
                />
            </View>

            <Text
                style={[
                    styles.inputLabel,
                    {
                        color: dark ? COLORS.grayscale100 : COLORS.greyscale900,
                    },
                ]}
            >
                Add detailed reason
            </Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        color: dark
                            ? COLORS.secondaryWhite
                            : COLORS.greyscale900,
                        borderColor: dark
                            ? COLORS.grayscale100
                            : COLORS.greyscale900,
                    },
                ]}
                placeholder="Write your reason here..."
                placeholderTextColor={
                    dark ? COLORS.secondaryWhite : COLORS.greyscale900
                }
                multiline
                onChangeText={handleCommentChange}
                value={comment}
                numberOfLines={4}
            />
        </View>
    )

    const renderSubmitButton = () => (
        <View
            style={[
                styles.btnContainer,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <Button
                title="Submit"
                filled
                style={styles.submitBtn}
                isLoading={isLoading}
                onPress={handleCancelBooking}
            />
        </View>
    )

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <Header title="Cancel Booking" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
            </View>
            {renderSubmitButton()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 12,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 0.3,
        borderRadius: 5,
        width: '100%',
        padding: 10,
        fontSize: 12,
        height: 150,
        textAlignVertical: 'top',
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.black,
        marginBottom: 6,
        marginTop: 16,
    },
    btnContainer: {
        position: 'absolute',
        bottom: 22,
        height: 72,
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        alignItems: 'center',
    },
    submitBtn: {
        width: SIZES.width - 32,
    },
})

export default CancelBooking
