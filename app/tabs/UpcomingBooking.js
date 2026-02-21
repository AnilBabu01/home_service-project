import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native'
import React, { useRef, useState, useCallback } from 'react'
import { SIZES, COLORS, images } from '../constants'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'
import { useGetBookingQuery } from '../redux/serverinstance'
import { useFocusEffect } from '@react-navigation/native'
import { width, height } from '../utils/responsive'
import chatBubble2 from '../assets/icons/chat-bubble.png'
import Rating from '../components/Rating'

const UpcomingBooking = () => {
    const [limit, setlimit] = useState(10)
    const [isSelect, setisSelect] = useState()
    const [page, setpage] = useState(1)
    const refRBSheet = useRef()
    const { dark } = useTheme()
    const navigation = useNavigation()

    const { data, isLoading, refetch } = useGetBookingQuery({
        type: '0',
        page: page,
        limit: limit,
    })

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [page, limit])
    )

    const loadMore = () => {
        if (page < data?.paginationData?.totalPages) {
            setpage((prevPage) => prevPage + 1)
        }
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
                },
            ]}
        >
            <FlatList
                data={data?.data}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.cardContainer,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.white,
                            },
                        ]}
                    >
                        <View style={styles.detailsContainer}>
                            <View>
                                <Image
                                    source={
                                        item?.service?.provider?.profile != null
                                            ? {
                                                  uri: `${item?.service?.provider?.profile}`,
                                              }
                                            : images?.default10
                                    }
                                    resizeMode="cover"
                                    style={styles.serviceImage}
                                />

                                {/* <View style={styles.reviewContainer}>
                                    <Text style={styles.rating}>
                                        {item?.service?.rating}
                                    </Text>
                                    <Rating
                                        rating={item?.service?.rating}
                                        size={12}
                                        margin={0}
                                        color={'orange'}
                                    />
                                </View> */}
                            </View>
                            <View style={styles.detailsRightContainer}>
                                <View
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.name,
                                            {
                                                color: dark
                                                    ? COLORS.secondaryWhite
                                                    : COLORS.greyscale900,
                                            },
                                        ]}
                                    >
                                        {item?.service?.provider?.name}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate('Chat', {
                                                item: item,
                                            })
                                        }
                                    >
                                        {console.log('c', item)}
                                        <Image
                                            source={chatBubble2}
                                            resizeMode="contain"
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor: COLORS.gray3,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Text
                                    style={[
                                        styles.address,
                                        {
                                            color: dark
                                                ? COLORS.grayscale400
                                                : COLORS.grayscale700,
                                        },
                                    ]}
                                >
                                    {item?.service?.address}
                                </Text>
                                <View style={styles.priceContainer}>
                                    <View style={styles.priceItemContainer}>
                                        <Text style={styles.totalPrice}>
                                            ₹{item.totalAmount}
                                        </Text>
                                    </View>
                                    <View style={styles.statusContainer}>
                                        <Text style={styles.statusText}>
                                            {item?.isAccept === '0' && 'Paid'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.separateLine,
                                {
                                    marginVertical: 10,
                                    backgroundColor: dark
                                        ? COLORS.greyScale800
                                        : COLORS.grayscale200,
                                },
                            ]}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    refRBSheet.current.open()
                                    setisSelect(item)
                                }}
                                style={styles.cancelBtn}
                            >
                                <Text style={styles.cancelBtnText}>
                                    Cancel Booking
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('EReceipt', {
                                        isBooking: item,
                                    })
                                }
                                style={styles.receiptBtn}
                            >
                                <Text style={styles.receiptBtnText}>
                                    View E-Receipt
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={
                    isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                        />
                    ) : null
                }
            />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={332}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.greyscale300
                            : COLORS.greyscale300,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 332,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: 'center',
                        width: '100%',
                    },
                }}
            >
                <Text
                    style={[
                        styles.bottomSubtitle,
                        {
                            color: dark ? COLORS.red : COLORS.red,
                        },
                    ]}
                >
                    Cancel Booking
                </Text>
                <View
                    style={[
                        styles.separateLine,
                        {
                            backgroundColor: dark
                                ? COLORS.greyScale800
                                : COLORS.grayscale200,
                        },
                    ]}
                />

                <View style={styles.selectedCancelContainer}>
                    <Text
                        style={[
                            styles.cancelTitle,
                            {
                                color: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Are you sure you want to cancel your apartment booking?
                    </Text>
                    <Text
                        style={[
                            styles.cancelSubtitle,
                            {
                                color: dark
                                    ? COLORS.grayscale400
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        Only 80% of the money you can refund from your payment
                        according to our policy.
                    </Text>
                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Cancel"
                        filled
                        style={styles.removeButton}
                        onPress={() => {
                            refRBSheet.current.close()
                            navigation.navigate('CancelBooking', {
                                item: isSelect,
                            })
                        }}
                    />
                </View>
            </RBSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.tertiaryWhite,
        marginVertical: 22,
    },
    cardContainer: {
        width: SIZES.width - 32,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    statusContainer: {
        width: width * 0.1,
        height: width * 0.07,
        borderRadius: 6,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.primary,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 10,
        color: COLORS.primary,
        fontFamily: 'medium',
    },
    separateLine: {
        width: '100%',
        height: 0.7,
        backgroundColor: COLORS.greyScale800,
        marginVertical: 12,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceImage: {
        width: 88,
        height: 88,
        borderRadius: 16,
        marginHorizontal: 12,
    },
    detailsRightContainer: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 17,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    address: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 6,
    },
    serviceTitle: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
    },
    serviceText: {
        fontSize: 12,
        color: COLORS.primary,
        fontFamily: 'medium',
        marginTop: 6,
    },
    cancelBtn: {
        width: (SIZES.width - 32) / 2 - 16,
        height: 36,
        borderRadius: 24,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
        marginBottom: 12,
    },
    cancelBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    receiptBtn: {
        width: (SIZES.width - 32) / 2 - 16,
        height: 36,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
        marginBottom: 12,
    },
    receiptBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    remindMeText: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 4,
    },
    switch: {
        marginLeft: 8,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the size of the switch
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    removeButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: 'red',
        textAlign: 'center',
    },
    bottomSubtitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginVertical: 12,
    },
    selectedCancelContainer: {
        marginVertical: 24,
        paddingHorizontal: 36,
        width: '100%',
    },
    cancelTitle: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        textAlign: 'center',
    },
    cancelSubtitle: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        textAlign: 'center',
        marginVertical: 8,
        marginTop: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    totalPrice: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    duration: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        textAlign: 'center',
    },
    priceItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    reviewContainer: {
        position: 'absolute',
        top: 6,
        right: 16,
        // width: 46,
        // height: 20,
        borderRadius: 16,
        backgroundColor: COLORS.transparentWhite2,
        zIndex: 999,
        flexDirection:'column-reverse',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rating: {
        fontSize: 12,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        // marginLeft: 4,
    },
})

export default UpcomingBooking
