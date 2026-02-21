import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { category } from '../data'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import WishlistServiceCard from '../components/WishlistServiceCard'
import { useTheme } from '../theme/ThemeProvider'
import { useFocusEffect } from '@react-navigation/native'
import {
    useGetCategoryQuery,
    useGetFavouriteServiceMutation,
    useAddFavouriteServiceMutation,
} from '../redux/serverinstance'
import { calculateAverageRating } from '../utils/functions'
import { showToast } from '../utils/showToast'

const Favourite = ({ navigation }) => {
    const refRBSheet = useRef()
    const { colors, dark } = useTheme()
    const [selectedWishlistItem, setSelectedWishlistItem] = useState({})
    const [myWishlistServices, setMyWishlistServices] = useState([])
    const [categories, setCategories] = useState([])
    const [categoriesIds, setcategoriesIds] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [getService, { isLoading }] = useGetFavouriteServiceMutation()
    const [paginationData, setpaginationData] = useState('')
    const { data: isCategories } = useGetCategoryQuery()

    const [addFavouriteService, { isLoading: isRemoving }] =
        useAddFavouriteServiceMutation()

    const fetchServices = async () => {
        try {
            const res = await getService({
                categories: selectedCategories,
                limit: limit,
                page: page,
            }).unwrap()

            if (Array.isArray(res?.data)) {
                setMyWishlistServices(res.data)
            } else {
                setMyWishlistServices([]) // Fallback to empty array
            }
        } catch (error) {
            console.log('Services Error:', error)
        }
    }

    const handleRemoveBookmark = async () => {
        try {
            const res = await addFavouriteService({
                service_id: selectedWishlistItem?.id,
            }).unwrap()

            if (refRBSheet.current) {
                refRBSheet.current.close()
            }

            showToast('Success!', res?.msg, 'success')

            // Recall fetchServices to refresh data
            await fetchServices()
        } catch (error) {
            console.log('Services Error:', error)
            if (refRBSheet.current) {
                refRBSheet.current.close()
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchServices()
            return () => {
                console.log('Screen is unfocused')
            }
        }, [selectedCategories, limit, page])
    )

    const loadMore = () => {
        if (page < paginationData?.totalPages) {
            setPage((prevPage) => prevPage + 1)
        }
    }

    useEffect(() => {
        if (isCategories) {
            setCategories(isCategories?.data)
        }
    }, [isCategories])

    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.arrowBack}
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
                        My Wishlist
                    </Text>
                </View>
                {/* <TouchableOpacity>
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
                </TouchableOpacity> */}
            </View>
        )
    }
    /**
     * Render my bookmark courses
     */
    const renderMyWishlistServices = () => {
        // Category item
        const renderCategoryItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    backgroundColor: selectedCategories.includes(item.id)
                        ? COLORS.primary
                        : 'transparent',
                    padding: 10,
                    marginVertical: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1.3,
                    borderRadius: 24,
                    marginRight: 12,
                }}
                onPress={() => toggleCategory(item.id)}
            >
                <Text
                    style={{
                        color: selectedCategories.includes(item.id)
                            ? COLORS.white
                            : COLORS.primary,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )

        // Toggle category selection
        const toggleCategory = (categoryId) => {
            const updatedCategories = [...selectedCategories]
            const index = updatedCategories.indexOf(categoryId)

            if (index === -1) {
                updatedCategories.push(categoryId)
            } else {
                updatedCategories.splice(index, 1)
            }

            setSelectedCategories(updatedCategories)
        }

        return (
            <View>
                <View style={styles.categoryContainer}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        renderItem={renderCategoryItem}
                    />
                </View>

                <FlatList
                    data={myWishlistServices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <WishlistServiceCard
                                name={item?.name}
                                image={item?.image}
                                providerName={item?.category?.name}
                                price={item?.hoursPrice}
                                isOnDiscount={item?.hoursPrice}
                                oldPrice={item?.hoursPrice}
                                rating={calculateAverageRating(
                                    item?.reviews ?? []
                                )}
                                numReviews={item?.reviews?.length ?? 0}
                                onPress={() =>
                                    navigation.navigate('ServiceDetails', {
                                        data: item,
                                    })
                                }
                                categoryId={item?.id}
                                bookmarkOnPress={() => {
                                    setSelectedWishlistItem(item)
                                    setTimeout(() => {
                                        if (refRBSheet.current) {
                                            refRBSheet.current.open()
                                        }
                                    }, 100)
                                }}
                            />
                        )
                    }}
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderMyWishlistServices()}
                </ScrollView>
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={380}
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
                        height: 380,
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
                            color: dark ? COLORS.white : COLORS.black,
                        },
                    ]}
                >
                    Remove from Bookmark?
                </Text>
                <View style={styles.separateLine} />

                <View
                    style={[
                        styles.selectedBookmarkContainer,
                        {
                            ackgroundColor: dark
                                ? COLORS.dark2
                                : COLORS.tertiaryWhite,
                        },
                    ]}
                >
                    {selectedWishlistItem && (
                        <WishlistServiceCard
                            name={selectedWishlistItem?.name}
                            image={selectedWishlistItem?.image}
                            providerName={selectedWishlistItem?.provider?.name}
                            price={selectedWishlistItem?.price}
                            isOnDiscount={selectedWishlistItem?.isOnDiscount}
                            oldPrice={selectedWishlistItem?.oldPrice}
                            rating={calculateAverageRating(
                                selectedWishlistItem?.reviews ?? []
                            )}
                            numReviews={
                                selectedWishlistItem?.reviews?.length ?? 0
                            }
                            onPress={() =>
                                navigation.navigate('ServiceDetails', {
                                    data: selectedWishlistItem,
                                })
                            }
                            categoryId={selectedWishlistItem?.id}
                            containerStyles={{
                                backgroundColor: COLORS.white,
                            }}
                        />
                    )}
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
                        title="Yes, Remove"
                        filled
                        style={styles.removeButton}
                        onPress={handleRemoveBookmark}
                        isLoading={isRemoving}
                    />
                </View>
            </RBSheet>
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
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 16,
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
    categoryContainer: {
        marginTop: 0,
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
    selectedBookmarkContainer: {
        marginVertical: 16,
    },
    separateLine: {
        width: '100%',
        height: 0.2,
        backgroundColor: COLORS.greyscale300,
        marginHorizontal: 16,
    },
})

export default Favourite
