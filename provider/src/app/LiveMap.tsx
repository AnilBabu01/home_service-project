import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Text, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_API_KEY } from "../utils/config";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getLocation } from "../components/PushNotification";
import { Ionicons } from "@expo/vector-icons";

const LiveMap = () => {
  const { isBooking } = useLocalSearchParams();
  const [IsData, setIsData] = useState<any>("");
  const router = useRouter();

  const [origin, setOrigin] = useState({
    latitude: 28.3532446,
    longitude: 79.8529569,
  });
  const [destination, setDestination] = useState({
    latitude: 28.2937839,
    longitude: 79.804459,
  });

  useEffect(() => {
    if (isBooking) {
      const fetchLocation = async () => {
        try {
          const itemString = Array.isArray(isBooking)
            ? isBooking[0]
            : isBooking;
          const parsedData = JSON.parse(itemString);
          setIsData(parsedData);

          setDestination({
            latitude: Number(parsedData.latitude),
            longitude: Number(parsedData.longitude),
          });
        } catch (error) {
          console.error("Error parsing item:", error);
          setIsData({});
        }
      };

      fetchLocation();
    }
  }, [isBooking]);

  return (
    <View style={styles.container}>
      {origin && destination && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 3,
            longitudeDelta: 3,
          }}
        >
          <Marker coordinate={origin} title="Origin">
            <View style={{ padding: 5, borderRadius: 10 }}>
              <Ionicons name="arrow-back-outline" size={30} color="blue" />
            </View>
          </Marker>

          <Marker coordinate={destination} title="Destination">
            <View style={{ padding: 5, borderRadius: 10 }}>
              <Ionicons name="home" size={30} color="green" />
            </View>
          </Marker>

          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="blue"
            optimizeWaypoints={true}
            onError={(errorMessage) => {
              console.error("Map directions error:", errorMessage);
            }}
          />
        </MapView>
      )}

      {router.canGoBack() ? (
        <Button title="Go Back" onPress={() => router.back()} />
      ) : (
        <Text>No back history</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default LiveMap;
