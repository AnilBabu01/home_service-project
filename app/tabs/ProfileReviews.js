import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, icons } from '../constants'
import { ScrollView } from 'react-native-virtualized-view'
import ReviewCard from '../components/ReviewCard'
import { Fontisto } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../theme/ThemeProvider'
import { calculateAverageRating } from '../utils/functions'
import { checkIdExists } from '../utils/functions'
import { useGetProfileQuery } from '../redux/serverinstance'

const ProfileReviews = ({ data, refetch }) => {
    const navigation = useNavigation()
    const { data: isProfile } = useGetProfileQuery({})
    const [selectedRating, setSelectedRating] = useState('All')
    const { colors, dark } = useTheme()
    const [ReviewList, setReviewList] = useState([])

    console.log(
        'sd',
        checkIdExists(data?.reviews[0]?.reviewLike, isProfile?.user?.id)
    )

    useEffect(() => {
        if (data) {
            setReviewList(data?.reviews)
        }
    }, [data])

    console.log('datass', calculateAverageRating(ReviewList))

    const renderRatingButton = (rating) => (
        <TouchableOpacity
            key={rating}
            style={[
                styles.ratingButton,
                selectedRating === rating && styles.selectedRatingButton,
            ]}
            onPress={() => setSelectedRating(rating)}
        >
            <Fontisto
                name="star"
                size={12}
                color={
                    selectedRating === rating ? COLORS.white : COLORS.primary
                }
            />
            <Text
                style={[
                    styles.ratingButtonText,
                    selectedRating === rating &&
                        styles.selectedRatingButtonText,
                ]}
            >
                {rating}
            </Text>
        </TouchableOpacity>
    )

    const filteredReviews =
        selectedRating === 'All'
            ? ReviewList
            : ReviewList.filter((review) => review.rating === selectedRating)

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.reviewHeaderContainer}>
                <View style={styles.reviewHeaderLeft}>
                    <Image
                        source={icons.star}
                        resizeMode="contain"
                        style={styles.starIcon}
                    />
                    {/* <Text
                        style={[
                            styles.starTitle,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >  {calculateAverageRating(ReviewList)} {ReviewList?.length} reviews
                    </Text> */}
                </View>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('ServiceDetailsReviews', {
                            data: data,
                        })
                    }
                >
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            {/* Horizontal FlatList for rating buttons */}
            <FlatList
                horizontal
                data={['All', 5, 4, 3, 2, 1]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => renderRatingButton(item)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ratingButtonContainer}
            />
            <FlatList
                data={filteredReviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <ReviewCard
                        avatar={item.user?.profile}
                        name={item?.user?.fullname}
                        description={item.review}
                        avgRating={item.rating}
                        date={item.createdAt}
                        numLikes={item?.reviewLike?.length}
                        data={item}
                        refetch={refetch}
                        checkIdExists={checkIdExists(
                            data?.reviews[0]?.reviewLike,
                            isProfile?.user?.id
                        )}
                    />
                )}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    reviewHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    reviewHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        width: 18,
        height: 18,
        tintColor: 'orange',
    },
    starTitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black2,
    },
    seeAll: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    // Styles for rating buttons
    ratingButtonContainer: {
        paddingVertical: 10,
    },
    ratingButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedRatingButton: {
        backgroundColor: COLORS.primary,
    },
    ratingButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        marginLeft: 10,
    },
    selectedRatingButtonText: {
        color: COLORS.white,
    },
})

export default ProfileReviews
