import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
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
import SocialButton from '../components/SocialButton'
import SocialButtonV2 from '../components/SocialButtonV2.js'
import OrSeparator from '../components/OrSeparator'
import { useTheme } from '../theme/ThemeProvider'
import {
    useRegisterMutation,
    useLogWithSocialMediaMutation,
    useLoginMutation,
} from '../redux/serverinstance'
import { showToast } from '../utils/showToast.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
        password: isTestMode ? '**********' : '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const Signup = ({ navigation }) => {
    const [register, { isSuccess, isError, isLoading }] = useRegisterMutation()
    const [login] = useLoginMutation()
    const [loginWithSocial, { isLoading: loading }] =
        useLogWithSocialMediaMutation()
    const [finalLoading, setfinalLoading] = useState(false)
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [error, setError] = useState(null)
    const [isChecked, setChecked] = useState(false)
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

    const handleRegister = async () => {
        try {
            setfinalLoading(true)
            if (!isChecked) {
                showToast('Error!', 'Please check privacy policy', 'danger')
                return
            }

            const email = formState.inputValues?.email
            const password = formState.inputValues?.password

            if (!email) {
                showToast('Error!', 'Email is required', 'danger')
                return
            }

            // if (!password) {
            //     showToast('Error!', 'Password is required', 'danger')
            //     return
            // }

            // Call your backend API to register
            const res = await register({
                email,
            }).unwrap()

            showToast(
                'Success!',
                res?.msg || 'Registered successfully',
                'success'
            )
            setfinalLoading(false)

            // Store something in AsyncStorage if needed
            await AsyncStorage.setItem(email, 'false')

            // 🔐 Now sign in with Firebase

            const firebaseUser = await auth().createUserWithEmailAndPassword(
                email,
                password
            )

            // 🔑 Get Firebase ID token
            const idToken = await firebaseUser.user.getIdToken()
            console.log('Firebase ID Token:', idToken)

            await loginWithSocial({ idToken }).unwrap()

            // Optionally: store or send `idToken` to backend

            // Navigate after successful login
            navigation.navigate('FillYourProfile', {
                data: formState.inputValues,
            })
        } catch (error) {
            console.log('Registration error:', error)
            showToast('Error!', error?.data?.msg || error?.message, 'danger')
            setfinalLoading(false);
        }
    }

    useEffect(() => {
        if (isSuccess) {
            navigation.navigate('FillYourProfile', {
                data: formState.inputValues,
            })

            // navigation.navigate('Login')
        }
    }, [isSuccess])

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
                        Create Your Account
                    </Text>
                    <Input
                        id="email"
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
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('SettingsPrivacyPolicy')
                                }
                            >
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
                                        By continuing you accept our{' '}
                                        <Text style={{ color: COLORS.primary }}>
                                            Privacy Policy{' '}
                                        </Text>
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Button
                        title="Sign Up"
                        filled
                        onPress={() => handleRegister()}
                        style={styles.button}
                        isLoading={finalLoading}
                    />
                    <View>
                        <OrSeparator text="or continue with" />
                        <View style={styles.socialBtnContainer}>
                            <SocialButtonV2
                                title="Continue with Google"
                                icon={icons.google}
                                onPress={googleAuthHandler}
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
                            Already have an account ?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.bottomRight}> Sign In</Text>
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
        // tintColor: COLORS.primary
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
        marginVertical: 50,
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
})

export default Signup
