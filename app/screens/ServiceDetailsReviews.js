import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, icons, illustrations } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import ReviewCard from '../components/ReviewCard'
import { Fontisto } from '@expo/vector-icons'
import { useTheme } from '../theme/ThemeProvider'
import Rating from '../components/Rating'
import Button from '../components/Button'
import { useAddReviewMutation } from '../redux/serverinstance'
import { showToast } from '../utils/showToast'
import { calculateAverageRating } from '../utils/functions'

const ServiceDetailsReviews = ({ navigation, route }) => {
    const [addServiceReview, { isLoading, isSuccess }] = useAddReviewMutation()

    const { colors, dark } = useTheme()
    const { data } = route.params
    const [modalVisible, setModalVisible] = useState(data?.canGiveReview)
    const [ReviewList, setReviewList] = useState([])
    const [review, setreview] = useState('')
    const [rating, setRating] = useState(0)

    handleAddReview = async () => {
        try {
            const res = await addServiceReview({
                service_id: data?.id,
                rating: rating.toString(),
                review: review,
            }).unwrap()
        } catch (error) {
            showToast('Error!', error?.data?.msg, 'danger')
            setModalVisible(false)
            navigation.pop(2)
        }
    }

    useEffect(() => {
        if (isSuccess) {
            showToast('Success!', 'Review submit successfully', 'success')
            setModalVisible(false)

            navigation.pop(2)
        }
    }, [isSuccess])

    useEffect(() => {
        if (data) {
            setReviewList(data?.reviews)
        }
    }, [data])

    useEffect(() => {
        setModalVisible(true)
    }, [])

    console.log('data  is data', data.canGiveReview)

    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={[
                                styles.backIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        {calculateAverageRating(ReviewList)} reviews
                    </Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.moreCircle}
                        resizeMode="contain"
                        style={[
                            styles.moreIcon,
                            {
                                tintColor: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    /**
     *
     * @returns render reviews modal
     */

    const renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View style={[styles.modalContainer]}>
                        <View
                            style={[
                                styles.modalSubContainer,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : COLORS.secondaryWhite,
                                },
                            ]}
                        >
                            <View style={styles.backgroundIllustration}>
                                <Image
                                    source={illustrations.background}
                                    resizeMode="contain"
                                    style={styles.modalIllustration}
                                />
                                <Image
                                    source={icons.editPencil}
                                    resizeMode="contain"
                                    style={styles.editPencilIcon}
                                />
                            </View>

                            <Rating
                                color={COLORS.primary}
                                rating={rating}
                                setRating={setRating}
                            />
                            <TextInput
                                placeholder="Enter your review 🔥"
                                placeholderTextColor={
                                    dark ? COLORS.secondaryWhite : COLORS.black
                                }
                                style={styles.modalInput}
                                value={review}
                                onChangeText={(text) => setreview(text)}
                            />

                            <Button
                                title="Write Review"
                                filled
                                onPress={() => {
                                    handleAddReview()
                                }}
                                style={{
                                    width: '100%',
                                    marginTop: 12,
                                }}
                                isLoading={isLoading}
                            />
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setModalVisible(false)
                                }}
                                textColor={dark ? COLORS.white : COLORS.primary}
                                style={{
                                    width: '100%',
                                    marginTop: 12,
                                    backgroundColor: dark
                                        ? COLORS.dark3
                                        : COLORS.tansparentPrimary,
                                    borderColor: dark
                                        ? COLORS.dark3
                                        : COLORS.tansparentPrimary,
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    /*
     ** render content
     */
    const renderContent = () => {
        const [selectedRating, setSelectedRating] = useState('All')

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
                        selectedRating === rating
                            ? COLORS.white
                            : COLORS.primary
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
                : ReviewList.filter(
                      (review) => review?.rating === selectedRating
                  )
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
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
                        />
                    )}
                />
            </ScrollView>
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
                {renderContent()}
            </View>
            {renderModal()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
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
        width: 16,
        height: 16,
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
        marginVertical: 12,
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
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 12,
        marginHorizontal: 16,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalSubContainer: {
        height: 622,
        width: SIZES.width * 0.86,
        backgroundColor: COLORS.white,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    backgroundIllustration: {
        height: 150,
        width: 150,
        marginVertical: 22,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -999,
    },
    modalIllustration: {
        height: 150,
        width: 150,
    },
    modalInput: {
        width: '100%',
        height: 52,
        backgroundColor: COLORS.tansparentPrimary,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderColor: COLORS.primary,
        borderWidth: 1,
        marginVertical: 12,
    },
    editPencilIcon: {
        width: 42,
        height: 42,
        tintColor: COLORS.white,
        zIndex: 99999,
        position: 'absolute',
        top: 54,
        left: 60,
    },
})

export default ServiceDetailsReviews
