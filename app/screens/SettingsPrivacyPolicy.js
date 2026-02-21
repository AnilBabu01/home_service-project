import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../constants'
import Header from '../components/Header'
import { ScrollView } from 'react-native-virtualized-view'
import { useTheme } from '../theme/ThemeProvider'
import { useGetSettingQuery } from '../redux/serverinstance'
import RenderHTML from 'react-native-render-html'

const SettingsPrivacyPolicy = () => {
    const { data, isLoading } = useGetSettingQuery()
    const { colors, dark } = useTheme()

    const { width } = useWindowDimensions()

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
                <Header title="Privacy Policy" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <RenderHTML
                        contentWidth={width}
                        source={{
                            html: data?.data[0]?.privacyPolicy
                                ? data?.data[0]?.privacyPolicy
                                : '<p>comming soon</p>',
                        }}
                        tagsStyles={{
                            body: {
                                color: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.greyscale900,
                                fontSize: 14,
                                fontFamily: 'regular',
                            },
                            p: {
                                color: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.greyscale900,
                                fontSize: 14,
                                fontFamily: 'regular',
                            },
                        }}
                    />
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
    settingsTitle: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 26,
    },
    body: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.black,
        marginTop: 4,
    },
})

export default SettingsPrivacyPolicy
