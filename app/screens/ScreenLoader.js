import { StyleSheet, Text, View, Image, StatusBar } from 'react-native'
import React from 'react'
import { COLORS, images } from '../constants'

const ScreenLoader = () => {
    return (
        <>
            <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.primary}
            />
            <View
                style={[styles.container, { backgroundColor: COLORS.primary }]}
            >
                <Text style={[styles.text, { color: COLORS.white }]}>
                    Loading...
                </Text>
                {/* <Image source={images.logo} style={{height:150,width:150}}/> */}
            </View>
        </>
    )
}

export default ScreenLoader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
})
