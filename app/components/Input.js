import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native'
import { COLORS, SIZES } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { Ionicons } from '@expo/vector-icons'

const Input = ({ id, onInputChanged, icon, errorText, hideActive, secureTextEntry, ...props }) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(secureTextEntry) // State for toggling password visibility
    const { dark } = useTheme()

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: hideActive
                            ? dark
                                ? COLORS.dark2
                                : COLORS.greyscale500
                            : isFocused
                                ? COLORS.primary
                                : dark
                                    ? COLORS.dark2
                                    : COLORS.greyscale500,
                        backgroundColor: hideActive
                            ? dark
                                ? COLORS.dark2
                                : COLORS.greyscale500
                            : isFocused
                                ? COLORS.tansparentPrimary
                                : dark
                                    ? COLORS.dark2
                                    : COLORS.greyscale500,
                    },
                ]}
            >
                {icon && (
                    <Image
                        source={icon}
                        style={[
                            styles.icon,
                            {
                                tintColor: hideActive
                                    ? '#BCBCBC'
                                    : isFocused
                                        ? COLORS.primary
                                        : '#BCBCBC',
                            },
                        ]}
                    />
                )}
                <TextInput
                    {...props}
                    onChangeText={(text) => onInputChanged(id, text)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={[
                        styles.input,
                        { color: dark ? COLORS.white : COLORS.black },
                    ]}
                    autoCapitalize="none"
                    secureTextEntry={showPassword}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color={isFocused ? COLORS.primary : '#BCBCBC'}
                            style={styles.passwordIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {errorText && errorText.length > 0 && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorText[0]}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding2,
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 5,
        flexDirection: 'row',
        height: 52,
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
        height: 20,
        width: 20,
        tintColor: '#BCBCBC',
    },
    input: {
        color: COLORS.black,
        flex: 1,
        fontFamily: 'regular',
        fontSize: 14,
        paddingTop: 0,
    },
    passwordIcon: {
        marginLeft: 10,
    },
    errorContainer: {
        marginVertical: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
})

export default Input
