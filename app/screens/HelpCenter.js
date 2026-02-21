import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    useWindowDimensions,
    FlatList,
    TextInput,
    LayoutAnimation,
    Linking,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import HelpCenterItem from '../components/HelpCenterItem'
import { useTheme } from '../theme/ThemeProvider'
import { ScrollView } from 'react-native-virtualized-view'
import { useNavigation } from '@react-navigation/native'
import {
    useGetFaqCategoryQuery,
    useGetFaqMutation,
    useGetSettingQuery,
} from '../redux/serverinstance'
const faqsRoute = () => {
    const { data } = useGetFaqCategoryQuery()
    const [getFaq] = useGetFaqMutation()
    const [selectedKeywords, setSelectedKeywords] = useState([])
    const [categories, setcategories] = useState([])
    const [categoriesId, setcategoriesId] = useState([])
    const [faqList, setfaqList] = useState([])
    const [limit, setlimit] = useState(10)
    const [page, setpage] = useState(1)
    const [expanded, setExpanded] = useState(-1)
    const [searchText, setSearchText] = useState('')
    const { dark } = useTheme()

    console.log("categoriesId",categoriesId);
    
    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const res = await getFaq({
                    categories: categoriesId,
                    limit,
                    page,
                }).unwrap()

                setfaqList(res?.data)
            } catch (error) {
                console.log('FAQ Error:', error)
            }
        }

        fetchFaq()
    }, [categoriesId, limit, page, getFaq])

    useEffect(() => {
        if (data) {
            setcategories(data?.data)
        }
    }, [data])

    const handleKeywordPress = (id) => {
        setSelectedKeywords((prevSelectedKeywords) => {
            if (prevSelectedKeywords.includes(id)) {
                return prevSelectedKeywords.filter(
                    (keywordId) => keywordId !== id
                )
            } else {
                return [...prevSelectedKeywords, id]
            }
        })

        setcategoriesId((prevCategoriesId) => {
            if (prevCategoriesId.includes(id)) {
                return prevCategoriesId.filter(
                    (categoryId) => categoryId !== id
                )
            } else {
                return [...prevCategoriesId, id]
            }
        })
    }

    const KeywordItem = ({ item, onPress, selected }) => {
        const itemStyle = {
            paddingHorizontal: 14,
            marginHorizontal: 5,
            borderRadius: 21,
            height: 39,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: COLORS.primary,
            borderWidth: 1,
            backgroundColor: selected ? COLORS.primary : 'transparent',
        }

        return (
            <TouchableOpacity
                style={itemStyle}
                onPress={() => onPress(item.id)}
            >
                <Text
                    style={{ color: selected ? COLORS.white : COLORS.primary }}
                >
                    {item?.name}
                </Text>
            </TouchableOpacity>
        )
    }

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExpanded((prevExpanded) => (prevExpanded === index ? -1 : index))
    }

    return (
        <View>
            <View style={{ marginVertical: 16 }}>
                <FlatList
                    data={categories}
                    horizontal
                    keyExtractor={(item) => item?.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <KeywordItem
                            item={item}
                            onPress={handleKeywordPress}
                            selected={selectedKeywords.includes(
                                item?.id
                            )}
                        />
                    )}
                />
            </View>
            <View
                style={[
                    styles.searchBar,
                    {
                        backgroundColor: dark
                            ? COLORS.dark2
                            : COLORS.grayscale100,
                    },
                ]}
            >
                <TouchableOpacity>
                    <Image
                        source={icons.search}
                        resizeMode="contain"
                        style={[
                            styles.searchIcon,
                            {
                                tintColor: dark
                                    ? COLORS.greyscale600
                                    : COLORS.grayscale400,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <TextInput
                    style={[
                        styles.input,
                        {
                            color: dark
                                ? COLORS.greyscale600
                                : COLORS.grayscale400,
                        },
                    ]}
                    placeholder="Search"
                    placeholderTextColor={
                        dark ? COLORS.greyscale600 : COLORS.grayscale400
                    }
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ marginVertical: 22 }}
            >
                {faqList
                    .filter((faq) =>
                        faq?.question
                            ?.toLowerCase()
                            ?.includes(searchText.toLowerCase())
                    )
                    .map((faq, index) => (
                        <View
                            key={index}
                            style={[
                                styles.faqContainer,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : COLORS.grayscale100,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => toggleExpand(index)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.questionContainer}>
                                    <Text
                                        style={[
                                            styles.question,
                                            {
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                            },
                                        ]}
                                    >
                                        {faq.question}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.icon,
                                            {
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                            },
                                        ]}
                                    >
                                        {expanded === index ? '-' : '+'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {expanded === index && (
                                <Text
                                    style={[
                                        styles.answer,
                                        {
                                            color: dark
                                                ? COLORS.secondaryWhite
                                                : COLORS.gray2,
                                        },
                                    ]}
                                >
                                    {faq.answer}
                                </Text>
                            )}
                        </View>
                    ))}
            </ScrollView>
        </View>
    )
}

const contactUsRoute = () => {
    const navigation = useNavigation()
    const { colors, dark } = useTheme()
    const { data: isSetting } = useGetSettingQuery()
    return (
        <View
            style={[
                styles.routeContainer,
                {
                    backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
                },
            ]}
        >
            <HelpCenterItem
                icon={icons.headset}
                title="Customer Service"
                onPress={() => navigation.navigate('CustomerService')}
            />
            <HelpCenterItem
                icon={icons.whatsapp}
                title="Whatsapp"
                onPress={() =>
                    Linking.openURL(
                        `https://wa.me/${isSetting?.data[0]?.whatsapp}`
                    )
                }
            />
            <HelpCenterItem
                icon={icons.world}
                title="Website"
                onPress={() =>
                    Linking.openURL(isSetting && isSetting?.data[0]?.Website)
                }
            />
            <HelpCenterItem
                icon={icons.facebook2}
                title="Facebook"
                onPress={() =>
                    Linking.openURL(isSetting && isSetting?.data[0]?.facebook)
                }
            />
            <HelpCenterItem
                icon={icons.twitter}
                title="Twitter"
                onPress={() =>
                    Linking.openURL(isSetting && isSetting?.data[0]?.twitter)
                }
            />
            <HelpCenterItem
                icon={icons.instagram}
                title="Instagram"
                onPress={() =>
                    Linking.openURL(isSetting && isSetting?.data[0]?.instagram)
                }
            />
        </View>
    )
}
const renderScene = SceneMap({
    first: faqsRoute,
    second: contactUsRoute,
})

const HelpCenter = ({ navigation }) => {
    const layout = useWindowDimensions()
    const { dark, colors } = useTheme()

    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'FAQ' },
        { key: 'second', title: 'Contact Us' },
    ])

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            }}
            renderLabel={({ route, focused, color }) => (
                <Text
                    style={[
                        {
                            color: COLORS.primary,
                            fontSize: 16,
                            fontFamily: 'bold',
                        },
                    ]}
                >
                    {route.title}
                </Text>
            )}
        />
    )
    /**
     * Render Header
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
                        Help Center
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
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    routeContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingVertical: 22,
    },
    searchBar: {
        width: SIZES.width - 32,
        height: 56,
        borderRadius: 16,
        backgroundColor: COLORS.grayscale100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    searchIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.grayscale400,
    },
    input: {
        flex: 1,
        color: COLORS.grayscale400,
        marginHorizontal: 12,
    },
    faqContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    question: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'semiBold',
        color: '#333',
    },
    icon: {
        fontSize: 18,
        color: COLORS.gray2,
    },
    answer: {
        fontSize: 14,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 10,
        fontFamily: 'regular',
        color: COLORS.gray2,
    },
})

export default HelpCenter
