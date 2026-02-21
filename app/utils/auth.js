import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const refreshIdTokenIfNeeded = async () => {
    try {
        const lastFetched = await AsyncStorage.getItem('tokenFetchedAt');
        const now = Date.now();

        if (!lastFetched || now - parseInt(lastFetched, 10) > 3600 * 1000) {
            const user = auth().currentUser;
            if (user) {
                const newIdToken = await user.getIdToken(true);
                await AsyncStorage.setItem('adminToken', newIdToken);
                await AsyncStorage.setItem('tokenFetchedAt', now.toString());
                console.log('Refreshed idToken after 1 hour');
            }
        }
    } catch (err) {
        console.log('Token refresh error:', err);
    }
}
