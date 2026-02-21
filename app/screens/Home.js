import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator,
    Dimensions,
    ImageBackground,
    StatusBar,
    RefreshControl,
} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { images, COLORS, SIZES, icons } from '../constants'
import { banners, categories, mostPopularServices } from '../data'
import SubHeaderItem from '../components/SubHeaderItem'
import Category from '../components/Category'
import ServiceCard from '../components/ServiceCard'
import { useTheme } from '../theme/ThemeProvider'
import {
    useGetCategoryQuery,
    useGetProfileQuery,
    useGetServiceMutation,
    useGetNotificationQuery,
    useGetSliderQuery,
} from '../redux/serverinstance'
import { calculateAverageRating } from '../utils/functions'
import messaging from '@react-native-firebase/messaging'

const { width } = Dimensions.get('window')

const Home = ({ navigation }) => {
    const { data: isCategories, refetch: refetchCategories } =
        useGetCategoryQuery()
    const { data: isProfile, refetch: refetchProfile } = useGetProfileQuery()
    const { data: isSlider, refetch: refetchSlider } = useGetSliderQuery({
        page: 1,
        limit: 10,
    })

    const [categories, setCategories] = useState([])
    const [categoriesIds, setcategoriesIds] = useState([])
    const [mostPopularServices, setmostPopularServices] = useState([])
    const [banners, setbanners] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const { dark, colors } = useTheme()
    const [limit, setlimit] = useState(10)
    const [page, setpage] = useState(1)
    const [paginationData, setpaginationData] = useState('')
    const [getService, { isLoading }] = useGetServiceMutation()
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = async () => {
        try {
            setRefreshing(true)
            await Promise.all([
                refetchCategories(),
                refetchProfile(),
                refetchSlider(),
            ])
        } catch (error) {
            console.log('Refresh error:', error)
        } finally {
            setRefreshing(false)
        }
    }

    const { data } = useGetNotificationQuery()
    const unseenCount = data?.pagination?.unseenCount || 0

    useEffect(() => {
        const unsubscribe = messaging().onNotificationOpenedApp(
            async (remoteMessage) => {
                console.log(
                    'App opened from background by notification:',
                    remoteMessage
                )

                if (remoteMessage?.data?.roomId) {
                    console.log(
                        'Room ID from background:',
                        remoteMessage?.data?.roomId
                    )

                    navigation.navigate('Chat', {
                        item: { roomId: remoteMessage?.data?.roomId },
                    })
                }
            }
        )

        return unsubscribe
    }, [])

    useFocusEffect(
        useCallback(() => {
            const fetchServices = async () => {
                try {
                    const res = await getService({
                        categories: categoriesIds,
                        limit: limit,
                        page: page,
                    }).unwrap()

                    if (res?.pagination) {
                        setpaginationData(res?.pagination)
                    }

                    if (categoriesIds != []) {
                        if (res?.data) {
                            setmostPopularServices(res?.data)
                        }
                    } else {
                        if (res?.data?.length) {
                            setmostPopularServices((prevData) => {
                                const newData = res.data.filter(
                                    (newItem) =>
                                        !prevData.some(
                                            (existingItem) =>
                                                existingItem.id === newItem.id
                                        )
                                )
                                return [...prevData, ...newData]
                            })
                        }
                    }
                } catch (error) {
                    console.log('Services Error:', error)
                }
            }

            fetchServices()
        }, [categoriesIds, limit, page])
    )

    const loadMore = () => {
        if (page < paginationData?.totalPages) {
            setpage((prevPage) => prevPage + 1)
        }
    }

    useEffect(() => {
        if (isCategories) {
            setCategories(isCategories?.data)
        }
        if (isSlider) {
            setbanners(isSlider?.data)
        }
    }, [isCategories, isSlider])

    const renderBannerItem = ({ item }) => (
        <View style={styles.bannerWrapper}>
            <ImageBackground
                source={{ uri: item?.image }}
                style={styles.bannerContainer}
            >
                {/* <View style={styles.bannerTopContainer}>
                    <View>
                        <Text style={styles.bannerDicount}>
                            {item.discount} OFF
                        </Text>
                        <Text style={styles.bannerDiscountName}>
                            {item?.title}
                        </Text>
                    </View>
                    <Text style={styles.bannerDiscountNum}>
                        {item.discount}
                    </Text>
                </View> */}
                <View style={styles.bannerBottomContainer}>
                    <Text style={styles.bannerBottomTitle}>
                        {item.bottomTitle}
                    </Text>
                    <Text style={styles.bannerBottomSubtitle}>
                        {item.bottomSubtitle}
                    </Text>
                </View>
            </ImageBackground>
        </View>
    )

    const keyExtractor = (item) => item.id.toString()

    const renderDot = (index) => {
        return (
            <View
                style={[
                    styles.dot,
                    index === currentIndex ? styles.activeDot : null,
                ]}
                key={index}
            />
        )
    }
    /**
     * Render Header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PersonalProfile')}
                    >
                        <Image
                            source={
                                isProfile?.user?.profile
                                    ? {
                                          uri: `${isProfile?.user?.profile}`,
                                      }
                                    : images?.default10
                            }
                            resizeMode="cover"
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.username,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Hi,{isProfile?.user?.fullname}!
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <Image
                        source={icons.bell}
                        resizeMode="contain"
                        style={[
                            styles.bellIcon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                    {unseenCount > 0 && (
                        <View style={styles.noti}>
                            <Text
                                style={{
                                    fontSize: width * 0.025,
                                    color: COLORS.white,
                                }}
                            >
                                {unseenCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * render search bar
     */
    const renderSearchBar = () => {
        const [search, setSearch] = useState('')
        const handleInputFocus = () => {
            // Redirect to another screen
            navigation.navigate('Search')
        }

        return (
            <View
                style={[
                    styles.searchContainer,
                    {
                        borderColor: dark ? COLORS.grayscale700 : '#E5E7EB',
                    },
                ]}
            >
                <TouchableOpacity>
                    <Image
                        source={icons.search2}
                        resizeMode="contain"
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={(value) => setSearch(value)}
                    placeholder="Search services..."
                    placeholderTextColor="#BABABA"
                    onFocus={handleInputFocus}
                />
                <TouchableOpacity>
                    <Image
                        source={icons.filter}
                        resizeMode="contain"
                        style={[
                            styles.filterIcon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * Render banner
     */

    const handleEndReached = () => {}

    const renderBanner = () => {
        return (
            <View style={styles.bannerItemContainer}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={COLORS.primary}
                />
                <FlatList
                    data={banners}
                    renderItem={renderBannerItem}
                    keyExtractor={keyExtractor}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x / SIZES.width
                        )
                        setCurrentIndex(newIndex)
                    }}
                />
                <View style={styles.dotContainer}>
                    {banners.map((_, index) => renderDot(index))}
                </View>
            </View>
        )
    }

    const toggleCategory = (category) => {
        setcategoriesIds((prev) => {
            if (prev.includes(category?.id)) {
                return prev.filter((id) => id !== category?.id)
            } else {
                return [...prev, category?.id]
            }
        })
    }

    /**
     * Render categories
     */
    const renderCategories = () => {
        return (
            <View>
                <SubHeaderItem
                    title="Categories"
                    navTitle="See all"
                    onPress={() => navigation.navigate('SeeAllCategories')}
                />
                <FlatList
                    data={categories.slice(0, 8)}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={false}
                    numColumns={4} // Render two items per row
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() =>
                                navigation.navigate('PopularServices', {
                                    data: item,
                                })
                            }
                        >
                            <Category
                                name={item.name}
                                icon={item.icon}
                                iconColor={item.bgColor}
                                backgroundColor={item.bgColor}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }

    /**
     * Render Top Services
     */
    const renderTopServices = () => {
        const renderCategoryItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    backgroundColor: categoriesIds.includes(item.id)
                        ? COLORS.primary
                        : 'transparent',
                    padding: 10,
                    marginVertical: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1.3,
                    borderRadius: 24,
                    marginRight: 12,
                }}
                onPress={() => toggleCategory(item)}
            >
                <Text
                    style={{
                        color: categoriesIds.includes(item.id)
                            ? COLORS.white
                            : COLORS.primary,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )

        return (
            <View style={{ paddingBottom: 55 }}>
                <SubHeaderItem
                    title="Popular Services"
                    navTitle="See all"
                    onPress={() => navigation.navigate('PopularServices')}
                />
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item?.id}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={renderCategoryItem}
                />

                <FlatList
                    data={mostPopularServices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <ServiceCard
                                name={item?.name}
                                image={item?.image}
                                providerName={item?.category?.name}
                                price={item.hoursPrice}
                                isOnDiscount={item.hoursPrice}
                                oldPrice={item.hoursPrice}
                                rating={calculateAverageRating(item?.reviews)}
                                data={item}
                                numReviews={item?.reviews?.length}
                                onPress={() =>
                                    navigation.navigate('ServiceDetails', {
                                        data: item,
                                    })
                                }
                                categoryId={item.category_id}
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
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                        />
                    }
                >
                    
                    {renderBanner()}
                    {renderCategories()}
                    {renderTopServices()}
                </ScrollView>
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SIZES.width - 32,
    },
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 999,
        marginRight: 12,
    },
    username: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.black,
    },
    bellIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.black,
    },
    noti: {
        width: width * 0.04,
        height: width * 0.04,
        borderRadius: width * 0.0225,
        backgroundColor: COLORS.red,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: -5,
        right: -5,
        minWidth: 18,
        minHeight: 18,
        zIndex: 99999,
        paddingHorizontal: 4,
    },

    headerLeft: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    searchContainer: {
        height: 50,
        width: SIZES.width - 32,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 22,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    searchIcon: {
        height: 20,
        width: 20,
        tintColor: '#BABABA',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        marginHorizontal: 8,
        borderRightColor: '#BABABA',
        borderRightWidth: 0.4,
    },
    filterIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.black,
    },
    bannerWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    bannerContainer: {
        width: SIZES.width - 32,
        height: width / 2,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
    },
    bannerTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerDicount: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.white,
        marginBottom: 4,
    },
    bannerDiscountName: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerDiscountNum: {
        fontSize: 46,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerBottomContainer: {
        marginTop: 8,
    },
    bannerBottomTitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
    },
    bannerBottomSubtitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
        marginTop: 4,
    },
    bannerItemContainer: {
        width: '100%',
        paddingBottom: 10,
        height: 170,
        borderRadius: 32,
        marginTop:10
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#ccc',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
})

export default Home
