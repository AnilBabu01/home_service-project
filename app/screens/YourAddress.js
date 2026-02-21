import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Pressable,
} from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { COLORS, FONTS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import RBSheet from 'react-native-raw-bottom-sheet'
import LocationItem from '../components/LocationItem'
import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import { mapDarkStyle, mapStandardStyle } from '../data/mapData'
import { getLocation } from '../pushnotification'
import {
    useGetProfileQuery,
    useAddBookingMutation,
    useGetSettingQuery,
} from '../redux/serverinstance'
import RazorpayCheckout from 'react-native-razorpay'


const GOOGLE_MAPS_API_KEY = 'AIzaSyCssKeSrktp0CeHRTtGLtGEuoDR-qlmn7A'
import { getDistance } from 'geolib'

const YourAddress = ({ navigation, route }) => {
    const bottomSheetRef = useRef(null)
    const detailsSheetRef = useRef(null)
    const [searchInput, setSearchInput] = useState('')
    const [filteredLocations, setFilteredLocations] = useState([])
    const [selectedLocation, setselectedLocation] = useState('')
    const [locationLoading, setlocationLoading] = useState(false)
    const [selectedCoords, setSelectedCoords] = useState()
    const [isBooking, setisBooking] = useState('')
    const [kilomitor, setkilomitor] = useState(0)
    const [paying, setpaying] = useState(false)
    const { colors, dark } = useTheme()
    const [addBooking, { isLoading, isSuccess }] = useAddBookingMutation()
    const { data: isUser } = useGetProfileQuery()
    const { data: Isetting } = useGetSettingQuery()
    const { amount, hour, startedDate, data, numbering, contextual } =
        route.params

    console.log(
        'ss',
        contextual?.filter((item) => item?.count !== 0)
    )

    const inputRef = useRef(null)

    const handleFocusInput = () => {
        inputRef.current?.focus()
    }

    useEffect(() => {
        bottomSheetRef.current.open()
    }, [])

    const calculateDistance = (destination) => {
        const distanceInMeters = getDistance(
            {
                latitude: parseFloat(data?.provider.latitude),
                longitude: parseFloat(data?.provider.longitude),
            },
            destination
        )
        const distanceInKilometers = distanceInMeters / 1000
        return distanceInKilometers.toFixed(2)
    }

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const location = await getLocation()
                console.log('Location:', location.coords)
                if (location) {
                    setSelectedCoords({
                        latitude: location?.coords?.latitude,
                        longitude: location?.coords?.longitude,
                    })

                    let kilo = calculateDistance({
                        latitude: location?.coords?.latitude,
                        longitude: location?.coords?.longitude,
                    })

                    setkilomitor(kilo)
                }
            } catch (error) {
                console.error('Error getting location:', error)
            }
        }

        fetchLocation()
    }, [])

    const handleSearchInput = async (text) => {
        setSearchInput(text)

        if (text.length < 2) return

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_MAPS_API_KEY}&types=geocode&components=country:IN`
            )
            const data = await response.json()

            if (data.predictions) {
                setFilteredLocations(
                    data.predictions.map((item) => ({
                        id: item.place_id,
                        location: item.structured_formatting.main_text,
                        address: item.description,
                        distance: null,
                    }))
                )
            }
        } catch (error) {
            console.error('Error fetching locations:', error)
        }
    }

    const handleSelectLocation = async (item) => {
        try {
            setlocationLoading(true)
            const detailsResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.id}&key=${GOOGLE_MAPS_API_KEY}`
            )
            const detailsData = await detailsResponse.json()

            setselectedLocation(item)

            console.log('from selecte', detailsData)

            if (detailsData.result) {
                setlocationLoading(false)
                const location = detailsData.result.geometry.location
                const latitude = location.lat
                const longitude = location.lng

                if (location) {
                    let kilo = calculateDistance({
                        latitude: latitude,
                        longitude: longitude,
                    })

                    setkilomitor(kilo)

                    console.log('hanlde selecte location is', kilomitor)
                }

                setSelectedCoords({ latitude, longitude })

                if (bottomSheetRef.current && detailsSheetRef.current) {
                    bottomSheetRef.current.close()
                    setTimeout(() => {
                        detailsSheetRef.current.open()
                        setlocationLoading(false)
                    }, 1)
                }
            }
        } catch (error) {
            console.error('Error fetching place details:', error)
        }
    }

    const doPayment = (orderId, bookingData) => {
        console.log('paying')

        var options = {
            description: 'Credits towards consultation',
            image: 'https://firebasestorage.googleapis.com/v0/b/aberpsolutions.appspot.com/o/ic_launcher_round.png?alt=media&token=a0bc2a67-cae8-4ce0-87fe-74fc5388de80',
            currency: 'INR',
            key: 'rzp_test_Z6XIfRaCupDhiQ',
            amount: (
                (amount * Isetting?.data[0]?.advanceAmountPercentage) /
                100
            ).toString(),
            name: 'AndamanHub',
            order_id: orderId,
            prefill: {
                email: isUser?.user?.email,
                contact: isUser?.user?.mobileno,
                name: isUser?.isUser?.fullname,
            },
            theme: { color: '#F37254' },
        }

        RazorpayCheckout.open(options)
            .then((data) => {
                console.log(' data is data is ReviewSummary', bookingData)
                navigation.navigate('ReviewSummary', {
                    isBooking: bookingData,
                })
            })
            .catch((error) => {
                console.log(`Error: ${error.code} | ${error.description}`)
            })
    }

    handleAddBooking = async () => {
        console.log('from fun')
        setpaying(true)
        const providerNumberings = numbering.map((item) => ({
            providerNumberingId: item.id,
            count: item.count,
        }))

        const res = await addBooking({
            service_id: data?.id,
            date: startedDate,
            time: hour?.slot,
            time_slot_id: hour?.id,
            amount: amount,
            // paymentMethod: selectedItem,
            tax: 0,
            totalAmount: amount,
            advanceAmount:
                (amount * Isetting?.data[0]?.advanceAmountPercentage) / 100,
            address: selectedLocation?.address,
            contextual: contextual.filter((item) => item?.count !== 0),
            latitude: selectedCoords?.latitude,
            longitude: selectedCoords?.longitude,
            providerNumberings: providerNumberings,
        }).unwrap()

        if (res?.status) {
            setisBooking(res?.data)
            setpaying(false)
            bottomSheetRef.current.close()
            detailsSheetRef.current.close()
            setTimeout(() => {
                doPayment(res?.extraData?.id, res?.data)
            }, 500)
        }
    }

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.headerIconContainer,
                        {
                            borderColor: dark
                                ? COLORS.dark1
                                : COLORS.grayscale200,
                        },
                    ]}
                >
                    <Image
                        source={icons.arrowBack}
                        resizeMode="contain"
                        style={[
                            styles.arrowBackIcon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        },
                    ]}
                >
                    Your Address
                </Text>
            </View>
        )
    }

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
                {renderHeader()}
                {selectedCoords?.latitude && selectedCoords?.longitude && (
                    <>
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            customMapStyle={
                                dark ? mapDarkStyle : mapStandardStyle
                            }
                            region={{
                                latitude: selectedCoords.latitude,
                                longitude: selectedCoords.longitude,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                            showsUserLocation={true}
                        >
                            <Marker
                                coordinate={{
                                    latitude: selectedCoords.latitude,
                                    longitude: selectedCoords.longitude,
                                }}
                                title="Provider Location"
                                description="This is where your provider is located"
                            />
                        </MapView>
                    </>
                )}
            </View>
            <View
                style={[
                    {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
            >
                <Pressable
                    style={[
                        styles.searchBarContainer,
                        {
                            backgroundColor: dark ? COLORS.dark2 : '#F9F9F9',
                        },
                    ]}
                    onPress={() => {
                        bottomSheetRef.current.open()
                    }}
                >
                    <View>
                        <Feather
                            name="search"
                            size={24}
                            color={
                                dark ? COLORS.grayscale400 : COLORS.greyscale900
                            }
                        />
                    </View>
                    <Text style={[{ marginLeft: 10 }]}>Search Location</Text>
                </Pressable>
            </View>

            <RBSheet
                ref={bottomSheetRef}
                height={300}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.grayscale700
                            : COLORS.grayscale400,
                        width: 100,
                    },
                    container: {
                        backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    },
                }}
            >
                <View
                    style={{
                        width: SIZES.width - 32,
                        marginHorizontal: 16,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        marginVertical: 22,
                    }}
                >
                    <Pressable onPress={handleFocusInput}>
                        <View
                            style={[
                                styles.searchBarContainer,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : '#F9F9F9',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                    borderRadius: 12,
                                    height: 50,
                                },
                            ]}
                        >
                            <TouchableOpacity>
                                <Feather
                                    name="search"
                                    size={24}
                                    color={
                                        dark
                                            ? COLORS.grayscale400
                                            : COLORS.greyscale900
                                    }
                                />
                            </TouchableOpacity>

                            <TextInput
                                ref={inputRef}
                                placeholder="Search Location"
                                placeholderTextColor={
                                    dark
                                        ? COLORS.grayscale200
                                        : COLORS.greyscale900
                                }
                                style={[
                                    styles.searchInput,
                                    { flex: 1, marginLeft: 10 },
                                ]}
                                value={searchInput}
                                onChangeText={handleSearchInput}
                            />
                        </View>
                    </Pressable>

                    <FlatList
                        data={filteredLocations}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <LocationItem
                                location={item.location}
                                address={item.address}
                                distance={item.distance}
                                onPress={() => handleSelectLocation(item)}
                            />
                        )}
                    />

                    <Button
                        title={`Process Payment (${(amount * Isetting?.data[0]?.advanceAmountPercentage) / 100})`}
                        filled
                        isLoading={paying}
                        style={{
                            height: 56,
                            borderRadius: 30,
                            width: SIZES.width - 32,
                            marginBottom: 12,
                            marginTop: SIZES.width / 3,
                        }}
                        onPress={() => {
                            handleAddBooking()
                        }}
                    />
                </View>
            </RBSheet>
            <RBSheet
                ref={detailsSheetRef}
                height={370}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.greyscale900
                            : COLORS.secondaryWhite,
                        width: 100,
                    },
                    container: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <View
                    style={{
                        width: SIZES.width - 32,
                        marginHorizontal: 16,
                        flexDirection: 'column',
                        marginVertical: 22,
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={[
                            styles.boxContainer,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark1
                                    : '#F2F4F9',
                            },
                        ]}
                    >
                        <Image
                            source={icons.pin}
                            resizeMode="contain"
                            style={styles.pinIcon}
                        />
                    </View>
                    <Text
                        style={[
                            styles.locationName,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        {isUser?.user?.fullname}
                    </Text>
                    <Text style={styles.locationAddress}>
                        {selectedLocation?.address}
                    </Text>
                    <View style={styles.viewLine}>
                        <View style={[styles.viewTime, { marginRight: 36 }]}>
                            <MaterialCommunityIcons
                                name="clock"
                                size={20}
                                color={COLORS.primary}
                            />
                            <Text
                                style={[
                                    styles.timeline,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {hour?.slot}
                            </Text>
                        </View>
                        <View style={styles.viewTime}>
                            <Image
                                source={icons.routing}
                                resizeMode="contain"
                                style={styles.routingIcon}
                            />
                            <Text
                                style={[
                                    styles.timeline,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {kilomitor} KM from you
                            </Text>
                        </View>
                    </View>

                    <View style={{ height: '10%' }} />

                    <Button
                        title={`Process Payment (${amount})`}
                        filled
                        isLoading={paying}
                        style={{
                            height: 56,
                            borderRadius: 30,
                            width: SIZES.width - 32,
                            marginBottom: 12,
                        }}
                        onPress={() => {
                            handleAddBooking()
                        }}
                    />
                </View>
            </RBSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    headerIconContainer: {
        height: 46,
        width: 46,
        borderWidth: 1,
        borderColor: COLORS.grayscale200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
    },
    arrowBackIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 15,
    },
    map: {
        height: '100%',
        zIndex: -9999,
    },
    // Callout bubble
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 'auto',
    },
    // Arrow below the bubble
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
        // marginBottom: -15
    },
    body3: {
        fontSize: 12,
        color: COLORS.gray5,
        marginVertical: 3,
    },
    h3: {
        fontSize: 12,
        color: COLORS.gray5,
        marginVertical: 3,
        fontFamily: 'bold',
        marginRight: 6,
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: '#F9F9F9',
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    searchInput: {
        paddingHorizontal: 6,
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    boxContainer: {
        width: 80,
        height: 80,
        borderRadius: 18,
        backgroundColor: '#F2F4F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinIcon: {
        width: 32,
        height: 32,
        tintColor: COLORS.primary,
    },
    locationName: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 8,
    },
    locationAddress: {
        fontSize: 14,
        fontFamily: 'medium',
        color: 'gray',
    },
    viewTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeline: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.black,
        marginLeft: 12,
    },
    routingIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.primary,
    },
    viewLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    separateLine: {
        height: 0.6,
        borderWidth: 0.2,
        borderColor: COLORS.gray,
        marginVertical: 12,
        width: SIZES.width - 32,
    },
    trackNumber: {
        fontSize: 14,
        fontFamily: 'medium',
        color: 'gray',
        textAlign: 'center',
    },
})

export default YourAddress
