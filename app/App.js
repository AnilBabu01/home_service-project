import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { useCallback, useEffect, useState } from 'react'
import { FONTS } from './constants/fonts'
import AppNavigation from './navigations/AppNavigation'
import { LogBox } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { serverinstance } from './redux/serverinstance'
import FlashMessage from 'react-native-flash-message'

// Notifications
import {
    requestUserPermission,
    setupForegroundNotificationHandler,
    subscribeToTopic,
    getPermission
} from './pushnotification'
import { refreshIdTokenIfNeeded } from './utils/auth'
// Google Sign-In
import { GoogleSignin } from '@react-native-google-signin/google-signin'

// Ignore log warnings and keep splash screen up
LogBox.ignoreAllLogs()
SplashScreen.preventAutoHideAsync()

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState(null)

    useEffect(() => {
        // Configure Google Sign-In
        GoogleSignin.configure({
            webClientId: '739276178108-9m873ndkpd7fsbtnrq9eem4ldf0e7gua.apps.googleusercontent.com', 
            offlineAccess: true,
        });

        // Notification permissions and handlers
        requestUserPermission().then((token) => {
            if (token) {
                setExpoPushToken(token)
            }
        });
        setupForegroundNotificationHandler();
        subscribeToTopic('user_topic');
        const locPerm = getPermission();
        console.log("location permission:", locPerm)
        refreshIdTokenIfNeeded();
    }, [])

    const [fontsLoaded] = useFonts(FONTS)

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null
    }

    return (
        <ThemeProvider>
            <SafeAreaProvider onLayout={onLayoutRootView}>
                <ApiProvider api={serverinstance}>
                    <AppNavigation />
                    <FlashMessage position="top" />
                </ApiProvider>
            </SafeAreaProvider>
        </ThemeProvider>
    )
}
