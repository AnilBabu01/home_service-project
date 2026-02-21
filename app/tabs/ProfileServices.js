import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
} from 'react-native'
import React, { useState } from 'react'
import { COLORS, icons } from '../constants'
import { Ionicons } from '@expo/vector-icons'
import ProviderLocationMap from '../components/ProviderLocationMap'
import { useTheme } from '../theme/ThemeProvider'

const ProfileServices = ({ data }) => {
    const { colors, dark } = useTheme()
    const initialNumberOfLines = 3

    const [textShown, setTextShown] = useState(false) // To show full text or not
    const [lengthMore, setLengthMore] = useState(false) // To determine if "View More" should be shown

    const toggleNumberOfLines = () => {
        setTextShown(!textShown)
    }

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={[dark ? styles.cellDark : styles.cell]}>
                {item.keyName}
            </Text>
            <Text style={[dark ? styles.cellDark : styles.cell]}>
                ₹ {item.amount}
            </Text>
            <Text style={[dark ? styles.cellDark : styles.cell]}>
                <Text style={styles.price}>
                    ₹{item?.amount - item?.onDiscount}
                </Text>
                {item?.onDiscount && (
                    <Text
                        style={[
                            styles.oldPrice,
                            {
                                color: dark
                                    ? COLORS.greyscale300
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        {'   '}₹{item?.amount}
                    </Text>
                )}
            </Text>
        </View>
    )

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Text
                style={[
                    styles.title,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
            >
                Description
            </Text>

            {/* Description Text */}
            <Text
                onTextLayout={(e) => {
                    if (e.nativeEvent.lines.length > initialNumberOfLines) {
                        setLengthMore(true)
                    }
                }}
                numberOfLines={textShown ? undefined : initialNumberOfLines}
                style={[
                    styles.description,
                    {
                        marginBottom: 10,
                        color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                    },
                ]}
            >
                {data?.description}
            </Text>

            {/* Toggle View More/Less */}
            {lengthMore ? (
                <TouchableOpacity onPress={toggleNumberOfLines}>
                    <Text style={{ color: COLORS.primary }}>
                        {textShown ? 'View Less' : 'View More'}
                    </Text>
                </TouchableOpacity>
            ) : null}

            <Text
                style={[
                    styles.title,
                    {
                        color: dark ? COLORS.white : COLORS.greyscale900,
                    },
                ]}
            >
                Service Type
            </Text>
            <View style={styles.typeContainer}>
                <Image
                    source={{ uri: data?.category?.icon }}
                    resizeMode="contain"
                    style={styles.categoryIcon}
                />
                <Text
                    style={[
                        styles.description,
                        {
                            color: dark
                                ? COLORS.grayscale200
                                : COLORS.grayscale700,
                        },
                    ]}
                >
                    {'  '}
                    {data?.category?.name}
                </Text>
            </View>

            <Text
                style={[
                    styles.title,
                    {
                        color: dark ? COLORS.white : COLORS.greyscale900,
                    },
                ]}
            >
                Plan list
            </Text>
            <View style={styles.container}>
                {/* Table Header */}
                <View
                    style={[
                        styles.row,
                        styles.header,
                        { backgroundColor: COLORS.primary },
                    ]}
                >
                    <Text style={styles.headerText}>Name</Text>
                    <Text style={styles.headerText}>Amount</Text>
                    <Text style={styles.headerText}>On discount</Text>
                </View>

                {/* Table Data */}
                <FlatList
                    data={data?.provider?.providerNumbering}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>

            <Text
                style={[
                    styles.title,
                    {
                        color: dark ? COLORS.white : COLORS.greyscale900,
                    },
                ]}
            >
                Location
            </Text>
            <View style={styles.locationContainer}>
                <Ionicons
                    name="location-outline"
                    size={14}
                    color={COLORS.primary}
                />
                <Text
                    style={[
                        styles.description,
                        {
                            color: dark
                                ? COLORS.grayscale200
                                : COLORS.grayscale700,
                        },
                    ]}
                >
                    {'  '}
                    {data?.address}
                </Text>
            </View>

            {data?.provider?.latitude && data?.provider?.longitude && (
                <ProviderLocationMap
                    providerCoordinates={{
                        latitude: parseFloat(data?.provider?.latitude),
                        longitude: parseFloat(data?.provider?.longitude),
                    }}
                />
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 12,
    },
    description: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        width: 14,
        height: 14,
        marginRight: 2,
        tintColor: COLORS.primary,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        padding: 5,
    },
    cellDark: {
        flex: 1,
        textAlign: 'center',
        padding: 5,
        color: '#ffff',
    },
    oldPrice: {
        fontSize: 14,
        fontFamily: 'medium',
        color: 'gray',
        textDecorationLine: 'line-through',
    },
})

export default ProfileServices
