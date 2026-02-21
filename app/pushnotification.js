import { PermissionsAndroid, Platform, Alert } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import { initializeApp } from '@react-native-firebase/app'
import { firebaseConfig } from './firebaseConfig'
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation'
// Initialize Firebase app
// const firebaseApp = initializeApp(firebaseConfig.config)


// Request all permissions for notifications
export async function requestUserPermission() {
    try {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            )
        }

        const authStatus = await messaging().requestPermission()
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL

        if (enabled) {
            console.log('Notification permission granted.')
            return await getToken()
        } else {
            console.log('Notification permission denied.')
        }
    } catch (error) {
        console.error('Error requesting permissions:', error)
    }
}

async function getToken() {
    try {
        const token = await messaging().getToken()

        return token
    } catch (error) {
        console.error('Error getting FCM Token:', error)
    }
}
export function setupForegroundNotificationHandler() {
    messaging().onMessage(async (remoteMessage) => {
        console.log('Foreground Notification:', remoteMessage)
        // Alert.alert(
        //     'New Notification',
        //     JSON.stringify(remoteMessage.notification)
        // )
    })

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Background Notification:', remoteMessage)
    })
}

export async function subscribeToTopic(topic) {
    try {
        await messaging().subscribeToTopic('user_topic')
        console.log(`Subscribed to topic: ${'user_topic'}`)
    } catch (error) {
        console.error(`Error subscribing to topic: ${error}`)
    }
}

export const getPermission = async () => {
    let permission
    if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    } else {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    }

    const result = await request(permission)

    if (result === RESULTS.GRANTED) {
    }
}

export const getLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
  };
  
