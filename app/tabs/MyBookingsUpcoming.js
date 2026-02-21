import React, { useState, useCallback, useRef } from 'react'
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import { COLORS, images } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../theme/ThemeProvider'
import { useGetBookingQuery } from '../redux/serverinstance'
import { useFocusEffect } from '@react-navigation/native'
import { formatDateHours } from '../utils/functions'

const MyBookingsUpcoming = () => {
    const [limit, setlimit] = useState(10)
    const [page, setpage] = useState(1)
    const [isSelect, setisSelect] = useState('')
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
        <View style={styles.container}>
            <FlatList
                data={data?.data}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.statusContainer}>
                            <Text
                                style={[
                                    styles.typeText,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {item?.service?.category?.name}
                            </Text>
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color:
                                            item.isAccept == '0'
                                                ? COLORS.green
                                                : COLORS.red,
                                        marginLeft: 12,
                                    },
                                ]}
                            >
                                {item?.isAccept === '0' && 'Pending'}
                            </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.infoLeft}>
                                <Image
                                    source={
                                        item?.service?.provider?.profile != null
                                            ? {
                                                  uri: `${item?.service?.provider?.profile}`,
                                              }
                                            : images?.default10
                                    }
                                    style={styles.itemImage}
                                />
                                <View style={styles.itemDetails}>
                                    <Text
                                        style={[
                                            styles.itemName,
                                            {
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.greyscale900,
                                            },
                                        ]}
                                    >
                                        {item?.service?.provider?.name}
                                    </Text>
                                    <View style={styles.itemSubDetails}>
                                        <Text
                                            style={[
                                                styles.itemPrice,
                                                {
                                                    color: dark
                                                        ? COLORS.grayscale200
                                                        : COLORS.grayscale700,
                                                },
                                            ]}
                                        >
                                            ₹{item.amount}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.itemDate,
                                                {
                                                    color: dark
                                                        ? COLORS.grayscale200
                                                        : COLORS.grayscale700,
                                                },
                                            ]}
                                        >
                                            {' '}
                                            | {formatDateHours(item.createdAt)}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.itemItems,
                                                {
                                                    color: dark
                                                        ? COLORS.grayscale200
                                                        : COLORS.grayscale700,
                                                },
                                            ]}
                                        >
                                            {' '}
                                            | {item.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.receiptText}>
                                {item.receipt}
                            </Text>
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('CancelBooking',{
                                        item: item,
                                    })
                                }
                                style={styles.rateButton}
                            >
                                <Text style={styles.rateButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('EReceipt', {
                                        isBooking: item,
                                    })
                                }
                                style={styles.reorderButton}
                            >
                                <Text style={styles.reorderButtonText}>
                                    View
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'column',
    },
    statusContainer: {
        borderBottomColor: COLORS.grayscale400,
        borderBottomWidth: 0.3,
        marginVertical: 12,
        flexDirection: 'row',
        paddingBottom: 4,
    },
    typeText: {
        fontSize: 14,
        fontFamily: 'bold',
    },
    statusText: {
        fontSize: 14,
        fontFamily: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        height: 60,
        width: 60,
        borderRadius: 8,
    },
    itemDetails: {
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemSubDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: 'bold',
    },
    itemDate: {
        fontSize: 12,
        fontFamily: 'regular',
        marginHorizontal: 2,
    },
    itemItems: {
        fontSize: 12,
        fontFamily: 'regular',
    },
    receiptText: {
        fontSize: 14,
        textDecorationLine: 'underline',
        textDecorationColor: COLORS.gray5,
        fontFamily: 'regular',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 18,
    },
    rateButton: {
        height: 38,
        width: 140,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 8,
    },
    rateButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontFamily: 'regular',
    },
    reorderButton: {
        height: 38,
        width: 140,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    reorderButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: 'regular',
    },
})

export default MyBookingsUpcoming
