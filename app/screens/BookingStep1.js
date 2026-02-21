import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { COLORS, SIZES } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { ScrollView } from 'react-native-virtualized-view'
import BookingItem from '../components/BookingItem'
import { bookingItems } from '../data'
import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import Input from '../components/Input'

const BookingStep1 = ({ navigation, route }) => {
    const { colors, dark } = useTheme()
    const { data } = route.params
    const [isData, setisData] = useState('')
    const [numbering, setnumbering] = useState([])
    const [amount, setAmount] = useState(0)

    useEffect(() => {
        if (data) {
            setisData(data)
            if (data?.provider?.providerNumbering) {
                setnumbering(data?.provider?.providerNumbering)
            }
        }
    }, [data])

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
                <Header title={isData?.category?.name} />

                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text
                        style={[
                            styles.itemNum,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                                marginTop: 22,
                            },
                        ]}
                    >
                        Number of item
                    </Text>
                    <FlatList
                        data={numbering}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <BookingItem
                                data={item}
                                numbering={numbering}
                                setnumbering={setnumbering}
                                setAmount={setAmount}
                            />
                        )}
                    />
                </ScrollView>
            </View>
            <View
                style={[
                    styles.bottomContainer,
                    {
                        backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    },
                ]}
            >
                <Button
                    title={`Continue - ₹${amount}`}
                    style={styles.bottomBtn}
                    filled
                    onPress={() =>
                        navigation.navigate('BookingDetails', {
                            numbering: numbering,
                            data: data,
                            amount: amount,
                            contextual: numbering,
                        })
                    }
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
    itemNum: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 84,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    bottomBtn: {
        width: SIZES.width - 32,
    },
})

export default BookingStep1
