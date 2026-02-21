import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
    StatusBar,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../constants'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import Input from '../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../components/Button'
import SocialButtonV2 from '../components/SocialButtonV2.js'
import OrSeparator from '../components/OrSeparator'
import { useTheme } from '../theme/ThemeProvider'
import {
    useLoginMutation,
    useRegisterMutation,
    useLogWithSocialMediaMutation,
} from '../redux/serverinstance'
import { showToast } from '../utils/showToast.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? '' : '',
        password: isTestMode ? '' : '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const Login = ({ navigation }) => {
    const [login, { isSuccess, isError, isLoading }] = useLoginMutation()
    const [register, { isResSuccess, isResError, isResLoading }] =
        useRegisterMutation()
    const [loginWithSocial, { isLoading: loading }] =
        useLogWithSocialMediaMutation()
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [finalLoading, setfinalLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isChecked, setChecked] = useState(false)
    const [isToken, setisToken] = useState('')
    const { colors, dark } = useTheme()

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error])

    useEffect(() => {
        const loadStoredCredentials = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email')
                const storedPassword = await AsyncStorage.getItem('password')
                const rememberMe = await AsyncStorage.getItem('rememberMe')

                console.log('ss', storedPassword)
                if (rememberMe === 'true' && storedEmail && storedPassword) {
                    dispatchFormState({
                        inputId: 'email',
                        validationResult: true,
                        inputValue: storedEmail,
                    })
                    dispatchFormState({
                        inputId: 'password',
                        validationResult: true,
                        inputValue: storedPassword,
                    })
                    setChecked(true)
                }
            } catch (error) {
                console.log('Error loading stored credentials:', error)
            }
        }

        loadStoredCredentials()
    }, [])

    const googleAuthHandler = async () => {
        try {
            const notificationToken = await messaging().getToken()
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            const token = userInfo?.data?.idToken

            const googleCredential = auth.GoogleAuthProvider.credential(token)

            const firebaseUserCredential =
                await auth().signInWithCredential(googleCredential)
            const firebaseUser = firebaseUserCredential.user

            const idToken = await firebaseUser.getIdToken()

            console.log('idToken is idToken', idToken)

            const isNewUser =
                firebaseUserCredential.additionalUserInfo?.isNewUser

            if (isNewUser) {
                const data = {
                    email: firebaseUser?.email,
                }

                const reg = await register(data).unwrap()

                if (reg?.status) {
                    await loginWithSocial({ idToken }).unwrap()
                    showToast(
                        'Success!',
                        'You have login successfully',
                        'success'
                    )
                }

                const payLoad = {
                    email: firebaseUser?.email,
                    notification_token: notificationToken,
                }

                const res = await login(payLoad).unwrap()
            } else {
                await loginWithSocial({ idToken }).unwrap()
                const payLoad = {
                    email: firebaseUser?.email,
                    notification_token: notificationToken,
                }

                const res = await login(payLoad).unwrap()

                showToast('Success!', 'You have login successfully', 'success')
            }
        } catch (error) {
            console.log('user login error', error)
        }
    }

    const handleLogin = async () => {
        try {
            setfinalLoading(true)
            await auth().signInWithEmailAndPassword(
                formState.inputValues.email,
                formState.inputValues.password
            )

            const idToken = await auth().currentUser.getIdToken()

            const notificationToken = await messaging().getToken()

            const data = {
                email: formState.inputValues.email,
                notification_token: notificationToken,
            }

            const res = await login(data).unwrap()

            await loginWithSocial({ idToken }).unwrap()
            setfinalLoading(false)
            showToast('Success!', res?.msg, 'success')

            // Handle remember me
            if (isChecked) {
                await AsyncStorage.setItem(
                    'password',
                    formState.inputValues.password
                )
                await AsyncStorage.setItem('rememberMe', 'true')
                await AsyncStorage.setItem('email', formState.inputValues.email)
            } else {
                await AsyncStorage.removeItem('password')
                await AsyncStorage.setItem('rememberMe', 'false')
            }
        } catch (error) {
            const message = error?.message || error?.data?.msg || 'Login failed'
            showToast('Error!', message, 'danger')
            setfinalLoading(false)
        }
    }

    useEffect(() => {
        if (isSuccess) {
            navigation.navigate('Main')
        }
    }, [isSuccess])

    return (
        <SafeAreaView
            style={[
                styles.area,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.primary}
            />

            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <Header />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: dark ? COLORS.white : COLORS.black,
                            },
                        ]}
                    >
                        Login to Your Account
                    </Text>
                    <Input
                        id="email"
                        value={formState.inputValues.email}
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        placeholder="Email"
                        placeholderTextColor={
                            dark ? COLORS.grayTie : COLORS.black
                        }
                        icon={icons.email}
                        keyboardType="email-address"
                    />
                    <Input
                        onInputChanged={inputChangedHandler}
                        value={formState.inputValues.password}
                        errorText={formState.inputValidities['password']}
                        autoCapitalize="none"
                        id="password"
                        placeholder="Password"
                        placeholderTextColor={
                            dark ? COLORS.grayTie : COLORS.black
                        }
                        icon={icons.padlock}
                        secureTextEntry={true}
                    />
                    <View style={styles.checkBoxContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                color={
                                    isChecked
                                        ? COLORS.primary
                                        : dark
                                          ? COLORS.primary
                                          : 'gray'
                                }
                                onValueChange={setChecked}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.privacy,
                                        {
                                            color: dark
                                                ? COLORS.white
                                                : COLORS.black,
                                        },
                                    ]}
                                >
                                    Remenber me
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        title="Login"
                        filled
                        onPress={() => handleLogin()}
                        style={styles.button}
                        isLoading={finalLoading}
                    />
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ForgotPasswordMethods')
                        }
                    >
                        <Text style={styles.forgotPasswordBtnText}>
                            Forgot the password?
                        </Text>
                    </TouchableOpacity>
                    <View>
                        <OrSeparator text="or continue with" />
                        <View style={styles.socialBtnContainer}>
                            <SocialButtonV2
                                title="Continue with Google"
                                icon={icons.google}
                                onPress={googleAuthHandler}
                                loading={loading}
                            />
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Text
                            style={[
                                styles.bottomLeft,
                                {
                                    color: dark ? COLORS.white : COLORS.black,
                                },
                            ]}
                        >
                            Don't have an account ?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text style={styles.bottomRight}>
                                {'  '}Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 16,
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 100,
        height: 100,
        // tintColor: COLORS.black
        borderRadius: 100,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        color: COLORS.black,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 22,
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 18,
    },
    checkbox: {
        marginRight: 8,
        height: 16,
        width: 16,
        borderRadius: 4,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    privacy: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    socialTitle: {
        fontSize: 19.25,
        fontFamily: 'medium',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 26,
    },
    socialBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 30,
        // position: 'absolute',
        bottom: 12,
        right: 0,
        left: 0,
    },
    bottomLeft: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'black',
    },
    bottomRight: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    button: {
        marginVertical: 6,
        width: SIZES.width - 32,
        borderRadius: 30,
    },
    forgotPasswordBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: 12,
    },
})

export default Login
