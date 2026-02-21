import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import ServiceCard from '../components/ServiceCard'
import { useTheme } from '../theme/ThemeProvider'
import {
    useGetCategoryQuery,
    useGetServiceMutation,
} from '../redux/serverinstance'
import { calculateAverageRating } from '../utils/functions'

const PopularServices = ({ navigation, route }) => {
    const data = route?.params?.data || null
    const { colors, dark } = useTheme()
    const [mostPopularServices, setmostPopularServices] = useState([])
    const [categories, setCategories] = useState([])
    const [categoriesIds, setcategoriesIds] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [getService, { isLoading }] = useGetServiceMutation()
    const [paginationData, setpaginationData] = useState('')
    const { data: isCategories } = useGetCategoryQuery()

    useEffect(() => {
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

    const loadMore = () => {
        if (page < paginationData?.totalPages) {
            setPage((prevPage) => prevPage + 1)
        }
    }

    useEffect(() => {
        if (isCategories) {
            setCategories(isCategories?.data)
            if (data != null) {
                setcategoriesIds([data?.id])
            }
        }
    }, [isCategories, data])

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
                        Most Popular Services
                    </Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.search}
                        resizeMode="contain"
                        style={[
                            styles.searchIcon,
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
     * Render popular services
     */

    const renderPopularServices = () => {
        const toggleCategory = (category) => {
            setcategoriesIds((prev) =>
                Array.isArray(prev)
                    ? prev.includes(category?.id)
                        ? prev.filter((id) => id !== category?.id)
                        : [...prev, category?.id]
                    : [category?.id]
            )
        }

        const renderCategoryItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    backgroundColor: categoriesIds?.includes(item?.id)
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
                        color: categoriesIds?.includes(item?.id)
                            ? COLORS.white
                            : COLORS.primary,
                    }}
                >
                    {item?.name}
                </Text>
            </TouchableOpacity>
        )

        return (
            <View>
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
                                providerName={item?.provider?.name}
                                price={item?.price}
                                isOnDiscount={item.isOnDiscount}
                                data={item}
                                oldPrice={item.oldPrice}
                                rating={calculateAverageRating(item?.reviews)}
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderPopularServices()}
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
    searchIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
})

export default PopularServices
