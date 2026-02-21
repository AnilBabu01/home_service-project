import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, SIZES } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
// import { ScrollView } from 'react-native-virtualized-view'
import DatePickerView from '../components/DatePickerView'
import { getFormatedDate } from 'react-native-modern-datepicker'
import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import { showToast } from '../utils/showToast'
import {
    useGetSlotByIDQuery,
    useGetTimeSlotByProviderIdQuery,
} from '../redux/serverinstance'

const BookingDetails = ({ navigation, route }) => {
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
    const [isTimeSlots, setisTimeSlots] = useState([]);
    const [hoursData, sethoursData] = useState([])
    const [selectedHour, setSelectedHour] = useState(null)
    const [hour, sethour] = useState(null)
    const today = new Date()

    const startDate = getFormatedDate(
        new Date(today.setDate(today.getDate() + 1)),
        'YYYY/MM/DD'
    )

    const [startedDate, setStartedDate] = useState('')
    const { colors, dark } = useTheme()

    const { numbering, data, amount, contextual } = route.params

    const providerId = data?.provider?.id
    const { data: timeSlotList, isLoading } = useGetTimeSlotByProviderIdQuery(
        providerId,
        {
            skip: !providerId,
        }
    )

  

    useEffect(() => {
       if(timeSlotList?.data)
       {
        setisTimeSlots(timeSlotList?.data)
       }
    }, [timeSlotList?.data])
    
    console.log('time slot list nowdd',isTimeSlots )

    useEffect(() => {
        if (data?.provider?.providerTimeSlot) {
            sethoursData(data?.provider?.providerTimeSlot)
        }
    }, [data])

    const handleHourSelect = (hour) => {
        setSelectedHour(hour)
    }

    // Render each hour as a selectable button

    const renderHourItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={[
                    styles.hourButton,
                    selectedHour === item.id && styles.selectedHourButton,
                ]}
                onPress={() => {
                    handleHourSelect(item.id)

                    sethour(item)
                }}
            >
                <Text
                    style={[
                        styles.hourText,
                        selectedHour === item.id && styles.selectedHourText,
                    ]}
                >
                    {item.slot}
                </Text>
            </TouchableOpacity>
        )
    }

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
                <Header title="Booking Details" />
                <ScrollView>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Select Date
                    </Text>
                    <DatePickerView
                        open={openStartDatePicker}
                        startDate={startDate}
                        selectedDate={startedDate}
                        onClose={() => setOpenStartDatePicker(false)}
                        onChangeStartDate={(date) => setStartedDate(date)}
                    />

                    <Text
                        style={[
                            styles.title,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Choose Start Time
                    </Text>
                    <View style={{ marginVertical: 12 }}>
                        <FlatList
                            data={isTimeSlots??[]}
                            renderItem={renderHourItem}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal={true}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </ScrollView>
            </View>
            <View
                style={[
                    styles.bottomContainer,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <Button
                    title={`Continue - ₹ ${amount}`}
                    filled
                    style={styles.button}
                    onPress={() => {
                        if (!hour) {
                            showToast(
                                'Error!',
                                'please select start time',
                                'danger'
                            )
                            return
                        }
                        if (!startedDate) {
                            showToast(
                                'Error!',
                                'please select start date',
                                'danger'
                            )
                            return
                        }
                        navigation.navigate('YourAddress', {
                            amount: amount,
                            hour: hour,
                            startedDate: startedDate,
                            data: data,
                            numbering: numbering,
                            contextual: contextual,
                        })
                    }}
                />
            </View>
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
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
        marginTop: 12,
    },
    ourContainer: {
        width: SIZES.width - 32,
        height: 72,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hourTitle: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.black,
        marginBottom: 12,
    },
    hourSubtitle: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120,
        justifyContent: 'space-between',
    },
    iconContainer: {
        height: 38,
        width: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        backgroundColor: COLORS.tansparentPrimary,
    },
    count: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    hourButton: {
        padding: 10,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
    },
    selectedHourButton: {
        backgroundColor: COLORS.primary,
    },
    selectedHourText: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.white,
    },
    hourText: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 22,
        left: 0,
        right: 0,
        width: '100%',
        height: 54,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    button: {
        width: SIZES.width - 32,
        height: 54,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
    },
})

export default BookingDetails
