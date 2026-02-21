import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, icons, illustrations } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../theme/ThemeProvider'
import Rating from '../../components/Rating'
import Button from '../../components/Button'
import { useAddReviewMutation } from '../../redux/serverinstance'
import { showToast } from '../../utils/showToast'
import { calculateAverageRating } from '../../utils/functions'
import { styles } from './styles'

const AddRating = ({ navigation, route }) => {
    const [addServiceReview, { isLoading, isSuccess }] = useAddReviewMutation()

    const { colors, dark } = useTheme()
    const { data } = route.params
    const [review, setreview] = useState('')
    const [rating, setRating] = useState(0)

    handleAddReview = async () => {
        try {

            console.log("zsdfv",{
                service_id: data?.service?.id,
                rating: rating.toString(),
                review: review,
                serviceBookingId: data?.id,
            })

            const res = await addServiceReview({
                service_id: data?.service?.id,
                rating: rating.toString(),
                review: review,
                serviceBookingId: data?.id,
            }).unwrap()

            console.log('ss', res)
        } catch (error) {
            showToast('Error!', error?.data?.msg, 'danger')
        }
    }

    useEffect(() => {
        if (isSuccess) {
            showToast('Success!', 'Review submit successfully', 'success')
        }
    }, [isSuccess])

    // console.log('data', data?.service?.id)

    return (
        <SafeAreaView style={[styles.area]}>
            <View>
                <TouchableWithoutFeedback onPress={() => {}}>
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
                                title="Back"
                                onPress={() => {
                                    navigation.goBack()
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
            </View>
        </SafeAreaView>
    )
}

export default AddRating
