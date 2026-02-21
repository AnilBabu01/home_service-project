import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES } from '../constants'
import { AntDesign } from '@expo/vector-icons'
import { useTheme } from '../theme/ThemeProvider'

const BookingItem = ({ data, numbering, setnumbering, setAmount }) => {
    const [count, setCount] = useState(Number(data?.count))
    const { colors, dark } = useTheme()

    console.log('data  is data', data)

    const updateNumbering = (newCount) => {
        setCount(newCount)

        // Update numbering array
        const updatedNumbering = numbering.map((item) =>
            item?.id === data?.id ? { ...item, count: newCount } : item
        )
        setnumbering(updatedNumbering)

        // Calculate the new total amount
        const newAmount = updatedNumbering.reduce(
            (sum, item) => sum + (item.amount - item?.onDiscount) * item.count,
            0
        )
        setAmount(newAmount)
    }

    const handleIncrease = () => updateNumbering(count + 1)

    const handleDecrease = () => {
        if (count > 0) {
            updateNumbering(count - 1)
        }
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                },
            ]}
        >
            <Text
                style={[
                    styles.name,
                    {
                        color: dark ? COLORS.white : COLORS.greyscale900,
                    },
                ]}
            >
                {data?.keyName}
            </Text>
            <View style={styles.viewContainer}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={handleDecrease}
                >
                    <AntDesign
                        name="minus"
                        size={16}
                        color={dark ? COLORS.white : 'black'}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.count,
                        {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        },
                    ]}
                >
                    {count}
                </Text>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={handleIncrease}
                >
                    <AntDesign
                        name="plus"
                        size={16}
                        color={dark ? COLORS.white : 'black'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        height: 52,
        borderRadius: 16,
        flexDirection: 'row',
        paddingHorizontal: 12,
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginVertical: 12,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 0,
    },
    name: {
        fontSize: 16,
        fontFamily: 'bold',
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
})

export default BookingItem
