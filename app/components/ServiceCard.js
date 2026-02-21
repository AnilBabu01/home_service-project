import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { FontAwesome } from '@expo/vector-icons'
import { useTheme } from '../theme/ThemeProvider'
import { IMAGE_BASE_URL } from '../utils/config'
import { useAddFavouriteServiceMutation } from '../redux/serverinstance'
import { showToast } from '../utils/showToast'

const ServiceCard = ({
    name,
    image,
    providerName,
    price,
    isOnDiscount,
    oldPrice,
    rating,
    numReviews,
    onPress,
    data,
}) => {
    const [isBookmarked, setIsBookmarked] = useState(
        data && data?.favourites[0]?.isfavourite ? true : false
    )
    const { dark } = useTheme()
    const [addFavouriteService, { isLoading }] =
        useAddFavouriteServiceMutation()
        
    const totalStars = 5
    const fullStars = Math.floor(rating) // Get the number of full stars
    const halfStar = rating % 1 >= 0.5 // Check if a half-star is needed
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0) // Remaining empty stars

    handleAddFavourite = async (data) => {
        try {
            const res = await addFavouriteService({
                service_id: data?.id,
            }).unwrap()

            console.log('add favoutore', res)
            showToast('Success!', res?.msg, 'success')
        } catch (error) {
            console.log('Services Error:', error)
        }
    }



    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                },
            ]}
        >
            <Image
                source={{ uri: `${image}` }}
                resizeMode="cover"
                style={styles.courseImage}
            />
            <View style={{ flex: 1 }}>
                <View style={styles.topContainer}>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryName}>{providerName}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setIsBookmarked(!isBookmarked)
                            handleAddFavourite(data)
                        }}
                    >
                        <Image
                            source={
                                isBookmarked ? icons.heart : icons.heartOutline
                            }
                            resizeMode="contain"
                            style={[
                                styles.bookmarkIcon,
                                {
                                    tintColor: isBookmarked
                                        ? COLORS.red
                                        : COLORS.primary,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
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
                    {name}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₹{price}</Text>
                    {isOnDiscount && (
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
                            {'   '}₹{oldPrice}
                        </Text>
                    )}
                </View>
                <View style={styles.ratingContainer}>
                    {/* Full Stars */}
                    {[...Array(fullStars)].map((_, index) => (
                        <FontAwesome
                            key={index}
                            name="star"
                            size={16}
                            color="orange"
                        />
                    ))}

                    {/* Half Star */}
                    {halfStar && (
                        <FontAwesome
                            name="star-half-empty"
                            size={16}
                            color="orange"
                        />
                    )}

                    {/* Empty Stars */}
                    {[...Array(emptyStars)].map((_, index) => (
                        <FontAwesome
                            key={`empty-${index}`}
                            name="star-o"
                            size={16}
                            color="orange"
                        />
                    ))}
                    <Text
                        style={[
                            styles.rating,
                            {
                                color: dark
                                    ? COLORS.greyscale300
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        {' '}
                        {rating}
                    </Text>
                    <Text
                        style={[
                            styles.numReviews,
                            {
                                color: dark
                                    ? COLORS.greyscale300
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        {' '}
                        | {numReviews} reviews
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 148,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 0,
        marginVertical: 8,
    },
    courseImage: {
        width: 124,
        height: 124,
        borderRadius: 16,
        marginRight: 16,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryContainer: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: COLORS.transparentTertiary,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    name: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    price: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.primary,
    },
    oldPrice: {
        fontSize: 14,
        fontFamily: 'medium',
        color: 'gray',
        textDecorationLine: 'line-through',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 14,
        fontFamily: 'medium',
        color: 'gray',
    },
    numReviews: {
        fontSize: 14,
        fontFamily: 'medium',
        color: 'gray',
        marginLeft: 8,
    },
})

export default ServiceCard
