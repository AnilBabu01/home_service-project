// screens/SplashScreen.js
import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>MyApp</Text>
            <ActivityIndicator size="large" color="#000" />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        fontSize: 32,
        marginBottom: 20,
        fontWeight: 'bold',
    },
})
