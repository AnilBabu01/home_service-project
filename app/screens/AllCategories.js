import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator,
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
} from '../redux/serverinstance'

const AllCategories = ({ navigation }) => {
    const { data: isCategories } = useGetCategoryQuery()
    const { data: isProfile } = useGetProfileQuery()
    const [categories, setCategories] = useState([])
    const { dark, colors } = useTheme()
    const [limit, setlimit] = useState(10)
    const [page, setpage] = useState(1)
    const [paginationData, setpaginationData] = useState('')

    const loadMore = () => {
        if (page < paginationData?.totalPages) {
            setpage((prevPage) => prevPage + 1)
        }
    }

    useEffect(() => {
        if (isCategories) {
            setCategories(isCategories?.data)
        }
    }, [isCategories])

    /**
     * Render Header
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
     * render search bar
    
    /**
     * Render banner
     */

    const handleEndReached = () => {}

    /**
     * Render categories
     */
    const renderCategories = () => {
        return (
            <View>
                <FlatList
                    data={categories}
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
                    {renderCategories()}
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
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
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
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    noti: {
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: COLORS.red,
        position: 'absolute',
        top: 0,
        right: 3,
        zIndex: 99999,
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
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
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
        backgroundColor: COLORS.primary,
        height: 170,
        borderRadius: 32,
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
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
})

export default AllCategories
