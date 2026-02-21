import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Modal,
    ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { ScrollView } from 'react-native-virtualized-view'
import PaymentMethodItem from '../components/PaymentMethodItem'
import { useTheme } from '../theme/ThemeProvider'
import { useAddBookingMutation } from '../redux/serverinstance'
import { showToast } from '../utils/showToast'
import { useGetSettingQuery } from '../redux/serverinstance'
const PaymentMethods = ({ navigation, route }) => {
    const [addBooking, { isLoading, isSuccess }] = useAddBookingMutation()
    const { data: Isetting } = useGetSettingQuery()
    const [modalVisible, setModalVisible] = useState(false)
    const { dark, colors } = useTheme()
    const [selectedItem, setSelectedItem] = useState(null)
    const [isBooking, setisBooking] = useState('')
    const {
        amount,
        hour,
        startedDate,
        data,
        numbering,
        selectedLocation,
        contextual,
        latitude,
        longitude,
    } = route.params

    console.log(
        'sdfg',
        (amount * Isetting?.data[0]?.advanceAmountPercentage) / 100
    )

    handleAddBooking = async () => {
        if (!selectedItem) {
            showToast('Error!', 'please select payment method', 'danger')
            return
        }

        const providerNumberings = numbering.map((item) => ({
            providerNumberingId: item.id,
            count: item.count,
        }))

        console.log('res data is', {
            service_id: data?.id,
            date: startedDate,
            time: hour?.slot,
            time_slot_id: hour?.id,
            amount: amount,
            paymentMethod: selectedItem,
            tax: 0,
            totalAmount: amount,
            advanceAmount:(amount * Isetting?.data[0]?.advanceAmountPercentage) / 100,
            address: selectedLocation?.address,
            latitude: latitude,
            longitude: longitude,
            providerNumberings: providerNumberings,
        })

        const res = await addBooking({
            service_id: data?.id,
            date: startedDate,
            time: hour?.slot,
            time_slot_id: hour?.id,
            amount: amount,
            paymentMethod: selectedItem,
            tax: 0,
            totalAmount: amount,
            advanceAmount:(amount * Isetting?.data[0]?.advanceAmountPercentage) / 100,
            address: selectedLocation?.address,
            contextual: contextual,
            latitude: latitude,
            longitude: longitude,
            providerNumberings: providerNumberings,
        }).unwrap()

        setisBooking(res?.data[0])
    }

    useEffect(() => {
        if (isSuccess) {
            setModalVisible(true)
        }
    }, [isSuccess])

    console.log('selectedItem', hour?.id)

    /**
     * Render Header
     */

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-outline"
                        size={24}
                        color={dark ? COLORS.white : COLORS.black}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        },
                    ]}
                >
                    Payment Methods
                </Text>
                <TouchableOpacity>
                    <Text style={styles.createTitle}>{'   '}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderContent = () => {
        const handleCheckboxPress = (itemTitle) => {
            if (selectedItem === itemTitle) {
                // If the clicked item is already selected, deselect it
                setSelectedItem(null)
            } else {
                // Otherwise, select the clicked item
                setSelectedItem(itemTitle)
            }
        }
        return (
            <View style={{ marginVertical: 12 }}>
                <PaymentMethodItem
                    checked={selectedItem === 'Visa Card'} // Check if it's the selected item
                    onPress={() => handleCheckboxPress('Visa Card')} // Pass the item title
                    title="Visa Card"
                    icon={icons.creditCard}
                />
                <PaymentMethodItem
                    checked={selectedItem === 'Paypal'}
                    onPress={() => handleCheckboxPress('Paypal')}
                    title="Paypal"
                    icon={icons.paypal}
                />
                <PaymentMethodItem
                    checked={selectedItem === 'Apple Pay'}
                    onPress={() => handleCheckboxPress('Apple Pay')}
                    title="Apple Pay"
                    icon={icons.appleLogo}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddNewPaymentMethod')}
                    style={[
                        styles.addBtn,
                        {
                            borderColor: dark
                                ? COLORS.secondaryWhite
                                : COLORS.gray,
                        },
                    ]}
                >
                    <AntDesign name="pluscircleo" size={24} color="#BABABA" />
                    <Text
                        style={[
                            styles.addBtnText,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        Add more
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    /**
     * Render Bottom Content
     */
    const renderBottomContent = () => {
        return (
            <View style={styles.bottomContainer}>
                <View style={styles.bottomLeft}>
                    <Text
                        style={[
                            styles.total,
                            {
                                color: dark ? COLORS.grayscale200 : '#767676',
                            },
                        ]}
                    >
                        Total:
                    </Text>
                    <Text
                        style={[
                            styles.totalPrice,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        {' '}
                        ₹ {(amount * Isetting?.data[0]?.advanceAmountPercentage) / 100}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => handleAddBooking()}
                    style={styles.bottomBtn}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <Text style={styles.bottomBtnText}>
                            Process Payment
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        )
    }

    // Render Success Modal
    const renderSuccessModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View
                            style={[
                                styles.modalSubContainer,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : COLORS.white,
                                },
                            ]}
                        >
                            <Image
                                source={icons.checked}
                                resizeMode="contain"
                                style={styles.successIcon}
                            />
                            <Text
                                style={[
                                    styles.modalTitle,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Booking Successfully
                            </Text>
                            <Text
                                style={[
                                    styles.modalSubtitle,
                                    {
                                        color: dark
                                            ? COLORS.grayscale200
                                            : '#6C6C6C',
                                    },
                                ]}
                            >
                                Get everything ready until it’s time to go on a
                                trip
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.navigate('ReviewSummary', {
                                        isBooking: isBooking,
                                    })
                                }}
                                style={styles.modalBtn}
                            >
                                <Text style={styles.modalBtnText}>
                                    Continue
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
                {renderHeader()}
                <ScrollView>{renderContent()}</ScrollView>
                {renderBottomContent()}
            </View>
            {renderSuccessModal()}
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    createTitle: {
        fontFamily: 'bold',
        color: COLORS.primary,
        fontSize: 16,
    },
    headerIconContainer: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E5E9EF',
        borderRadius: 7.7,
        borderWidth: 1,
    },
    addBtn: {
        height: 64,
        width: SIZES.width - 32,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: COLORS.gray,
        borderWidth: 0.4,
        borderRadius: 30,
    },
    addBtnText: {
        fontSize: 14,
        fontFamily: 'medium',
        marginLeft: 12,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 12,
        width: SIZES.width - 32,
        right: 16,
        left: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    total: {
        fontSize: 12,
        color: '#767676',
        fontFamily: 'regular',
    },
    totalPrice: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    bottomBtn: {
        width: 175,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
    },
    bottomBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalSubContainer: {
        height: 400,
        width: SIZES.width * 0.86,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 16,
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: 'regular',
        color: '#6C6C6C',
        textAlign: 'center',
        marginVertical: 16,
    },
    modalBtn: {
        width: SIZES.width * 0.72,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 30,
    },
    modalBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white,
    },
    successIcon: {
        width: 125,
        height: 125,
        tintColor: COLORS.primary,
    },
})
export default PaymentMethods
