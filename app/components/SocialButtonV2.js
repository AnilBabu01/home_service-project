import { Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, View } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const SocialButtonV2 = ({ title, icon, onPress, iconStyles, loading }) => {
  const { dark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          borderColor: dark ? COLORS.dark2 : "gray",
        }
      ]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={dark ? COLORS.white : COLORS.black} />
      ) : (
        <View style={styles.content}>
          <Image
            source={icon}
            resizeMode='contain'
            style={[styles.icon, iconStyles]}
          />
          <Text style={[
            styles.title,
            { color: dark ? COLORS.white : COLORS.black }
          ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 1
  },
  content: {
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: 32
  },
  title: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.black
  }
});

export default SocialButtonV2;
