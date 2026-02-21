import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { IMAGE_BASE_URL } from '../utils/config'

const Category = ({ name, icon, iconColor, backgroundColor }) => {
    const { dark } = useTheme()

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: backgroundColor,
                        opacity: 0.2,
                    },
                ]}
            ></TouchableOpacity>

            <Text
                style={[
                    styles.name,
                    {
                        color: dark ? COLORS.white : COLORS.greyscale900,
                    },
                ]}
            >
                {name}
            </Text>
            <Image
                source={{ uri: `${icon}` }}
                resizeMode="contain"
                style={[
                    styles.icon,
                    {
                        tintColor: iconColor,
                    },
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 12,
        width: (SIZES.width - 32) / 4,
        position: 'relative',
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        height: 24,
        width: 24,
        position: 'absolute',
        top: '17%',
    },
    name: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.black,
    },
})

export default Category
