import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { COLORS,SIZES } from '@/constants';
import { getTimeAgo } from '@/src/utils/allFunctions';

interface NotificationCardProps {
    icon: ImageSourcePropType;
    title: string;
    description: string;
    date: Date | string;
    onPress?: () => void;
}

const Index: React.FC<NotificationCardProps> = ({ icon, title, description, date, onPress }) => {
   

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.leftContainer}>
                <TouchableOpacity style={styles.iconContainer}>
                    <Image source={icon} resizeMode='cover' style={styles.icon} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.title, { color:  COLORS.greyscale900 }]}>
                        {title}
                    </Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            </View>
            <Text style={styles.date}>{getTimeAgo(date)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
        width: SIZES.width - 32,
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        height: 44,
        width: 44,
        backgroundColor: COLORS.black2,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        marginRight: 12,
    },
    icon: {
        width: 22,
        height: 22,
        tintColor: COLORS.white,
    },
    title: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.black,
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        fontFamily: "regular",
        color: "gray",
    },
    date: {
        fontSize: 12,
        fontFamily: "regular",
        color: "gray",
    },
});

export default Index;
