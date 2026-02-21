import { View, Platform, Image, Text } from 'react-native'
import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS, icons } from '../constants'
import { Bookings, Favourite, Home, Inbox, Profile } from '../screens'
import { useTheme } from '../theme/ThemeProvider'
import { useNavigation } from '@react-navigation/native'
import { useGetProfileQuery } from '../redux/serverinstance';

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
    const navigation = useNavigation()
    const { data, isLoading } = useGetProfileQuery()
    const { dark } = useTheme()

    useEffect(() => {
        if (data?.user?.profilefilled === false) {
            if (isLoading === false) {
                navigation.replace('FillYourProfile', {
                    data: { email: data?.user?.email },
                })
            }
        }
    }, [data, navigation, isLoading])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    justifyContent: 'center',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 90 : 60,
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    borderTopColor: 'transparent',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.home
                                            : icons.home2Outline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                >
                                    Home
                                </Text>
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={Bookings}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.document2
                                            : icons.document2Outline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                >
                                    Bookings
                                </Text>
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Favourite"
                component={Favourite}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.heart2
                                            : icons.heart2Outline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                >
                                    Favourite
                                </Text>
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Inbox"
                component={Inbox}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.chatBubble2
                                            : icons.chatBubble2Outline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                >
                                    Inbox
                                </Text>
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused ? icons.user : icons.userOutline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : dark
                                              ? COLORS.gray3
                                              : COLORS.gray3,
                                    }}
                                >
                                    Profile
                                </Text>
                            </View>
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation
