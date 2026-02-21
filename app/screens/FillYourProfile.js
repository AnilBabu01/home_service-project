import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    FlatList,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {
    COLORS,
    SIZES,
    FONTS,
    icons,
    illustrations,
    images,
} from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons'
import { launchImagePicker } from '../utils/ImagePickerHelper'
import Input from '../components/Input'
import { getFormatedDate } from 'react-native-modern-datepicker'
import DatePickerModal from '../components/DatePickerModal'
import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import { useCompleteProfileMutation } from '../redux/serverinstance'
import { showToast } from '../utils/showToast.js'

const isTestMode = true

const initialState = {
    inputValues: {
        fullName: isTestMode ? 'John Doe' : '',
        email: isTestMode ? 'example@gmail.com' : '',
        nickname: isTestMode ? 'null' : '',
        phoneNumber: '',
    },
    inputValidities: {
        fullName: false,
        email: false,
        nickname: true,
        phoneNumber: false,
    },
    formIsValid: false,
}

const FillYourProfile = ({ navigation, route }) => {
    const [editprofile, { isSuccess, isError, isLoading }] =
        useCompleteProfileMutation()
    const { data } = route.params
    const [image, setImage] = useState(null)
    const [error, setError] = useState()
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [areas, setAreas] = useState([])
    const [selectedArea, setSelectedArea] = useState({
        callingCode: '+91',
        code: 'IN',
        flag: 'https://flagsapi.com/IN/flat/64.png',
        item: 'India',
    })
    const [modalVisible, setModalVisible] = useState(false)
    const [modalContinueVisible, setmodalContinueVisible] = useState(false)
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
    const { colors, dark } = useTheme()
    const [email, setEmail] = useState('')
    const [fullname, setFullname] = useState('')
    const [nickname, setNickname] = useState('')
    const [mobileno, setMobileno] = useState('')

    console.log('mobileno  is mobileno', mobileno)


    useEffect(() => {
        if (data) {
            setEmail(data?.email)
        }
    }, [data])

    const handleEditProfile = async () => {
        try {
            const formData = new FormData()
            formData.append('fullname', fullname)
            formData.append('email', email)
            formData.append('nickname', nickname ?? 'null')
            formData.append('dob', startedDate)
            formData.append('mobileno', mobileno)

            if (image) {
                formData.append('profile', {
                    uri: image.uri,
                    name: 'upload.jpg',
                    type: 'image/jpeg',
                })
            }

            console.log('ssssss formData is formData', formData)

            const res = await editprofile(formData).unwrap()
            setmodalContinueVisible(true)
            showToast(
                'Success!',
                res?.msg ?? 'Profile updated successfully',
                'success'
            )
        } catch (error) {
            console.log('API error:', error)

            showToast(
                'Error!',
                error?.data?.msg ?? 'Something went wrong',
                'danger'
            )
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setmodalContinueVisible(true)
        }
    }, [isSuccess])

    const today = new Date()

    const startDate = getFormatedDate(
        new Date(today.setDate(today.getDate() + 1)),
        'YYYY/MM/DD'
    )

    const [startedDate, setStartedDate] = useState('12/12/2023')

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker)
    }

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

    const pickImage = async () => {
        try {
            const tempUri = await launchImagePicker()

            if (!tempUri) return

            // set the image
            setImage({ uri: tempUri })
        } catch (error) {}
    }

    // fectch codes from rescountries api
    useEffect(() => {
        fetch('https://restcountries.com/v2/all')
            .then((response) => response.json())
            .then((data) => {
                let areaData = data.map((item) => {
                    return {
                        code: item.alpha2Code,
                        item: item.name,
                        callingCode: `+${item.callingCodes[0]}`,
                        flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`,
                    }
                })

                setAreas(areaData)
                if (areaData.length > 0) {
                    let defaultData = areaData.filter((a) => a.code == 'IN')

                    if (defaultData.length > 0) {
                        setSelectedArea(defaultData[0])
                    }
                }
            })
    }, [])

    console.log('area', selectedArea)

    // render countries codes modal
    function RenderAreasCodesModal() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: 10,
                        flexDirection: 'row',
                    }}
                    onPress={() => {
                        setSelectedArea(item), setModalVisible(false)
                    }}
                >
                    <Image
                        source={{ uri: item.flag }}
                        contentFit="contain"
                        style={{
                            height: 30,
                            width: 30,
                            marginRight: 10,
                        }}
                    />
                    <Text style={{ fontSize: 16, color: '#fff' }}>
                        {item.item}
                    </Text>
                </TouchableOpacity>
            )
        }
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                height: SIZES.height,
                                width: SIZES.width,
                                backgroundColor: COLORS.primary,
                                borderRadius: 12,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeBtn}
                            >
                                <Ionicons
                                    name="close-outline"
                                    size={24}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <FlatList
                                data={areas}
                                renderItem={renderItem}
                                horizontal={false}
                                keyExtractor={(item) => item.code}
                                style={{
                                    padding: 20,
                                    marginBottom: 20,
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    // Render modal
    const renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalContinueVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setmodalContinueVisible(false)}
                >
                    <View style={[styles.modalContainer]}>
                        <View
                            style={[
                                styles.modalSubContainer,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : COLORS.secondaryWhite,
                                },
                            ]}
                        >
                            <Image
                                source={illustrations.passwordSuccess}
                                resizeMode="contain"
                                style={styles.modalIllustration}
                            />
                            <Text style={styles.modalTitle}>
                                Congratulations!
                            </Text>
                            <Text
                                style={[
                                    styles.modalSubtitle,
                                    {
                                        color: dark
                                            ? COLORS.grayTie
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Your account is ready to use. You will be
                                redirected to the Home page in a few seconds..
                            </Text>
                            <Button
                                title="Continue"
                                filled
                                onPress={() => {
                                    setmodalContinueVisible(false)
                                    navigation.navigate('Main')

                                    console.log('clic')
                                }}
                                style={{
                                    width: '100%',
                                    marginTop: 12,
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <StatusBar
                backgroundColor={COLORS.primary}
                barStyle="light-content"
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <Header title="Fill Your Profile" />

                    <View style={{ alignItems: 'center', marginVertical: 12 }}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={
                                    image === null ? images.default10 : image
                                }
                                resizeMode="cover"
                                style={styles.avatar}
                            />
                            <TouchableOpacity
                                onPress={pickImage}
                                style={styles.pickImage}
                            >
                                <MaterialCommunityIcons
                                    name="pencil-outline"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: 16 }}>
                        <Input
                            id="fullName"
                            onInputChanged={(id, text) => setFullname(text)}
                            value={fullname}
                            placeholder="Full Name"
                            placeholderTextColor={
                                dark ? COLORS.gray : COLORS.black
                            }
                        />
                        <Input
                            id="Nickname"
                            onInputChanged={(id, text) => setNickname(text)}
                            value={nickname}
                            placeholder="Nickname"
                            placeholderTextColor={
                                dark ? COLORS.gray : COLORS.black
                            }
                        />
                        <Input
                            id="email"
                            onInputChanged={(id, text) => setEmail(text)}
                            value={email}
                            placeholder="Email"
                            placeholderTextColor={
                                dark ? COLORS.gray : COLORS.black
                            }
                        />

                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.greyscale500,
                                padding: 12,
                                marginVertical: 10,
                                borderRadius: 8,
                            }}
                            onPress={handleOnPressStartDate}
                        >
                            <Text
                                style={{
                                    ...FONTS.body4,
                                    color: COLORS.grayscale400,
                                    flex: 1,
                                }}
                            >
                                {startedDate}
                            </Text>
                            <Feather
                                name="calendar"
                                size={20}
                                color={COLORS.grayscale400}
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.greyscale500,
                                padding: 10,
                                borderRadius: 8,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 8,
                                }}
                                onPress={() => setModalVisible(true)}
                            >
                                <Image
                                    source={icons.down}
                                    resizeMode="contain"
                                    style={{ width: 12, height: 12 }}
                                />
                                <Image
                                    source={{ uri: selectedArea?.flag }}
                                    style={{
                                        width: 20,
                                        height: 14,
                                        marginHorizontal: 5,
                                    }}
                                />
                                <Text
                                    style={{
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.black,
                                        fontSize: 12,
                                    }}
                                >
                                    {selectedArea?.callingCode}
                                </Text>
                            </TouchableOpacity>

                            <TextInput
                                style={{
                                    flex: 1,
                                    color: COLORS.black,
                                    fontSize: 14,
                                    paddingVertical: 4,
                                }}
                                placeholder="Enter your phone number"
                                placeholderTextColor={COLORS.gray}
                                selectionColor="#111"
                                keyboardType="numeric"
                                value={mobileno}
                                onChangeText={(text) => setMobileno(text)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <DatePickerModal
                open={openStartDatePicker}
                selectedDate={startedDate}
                onClose={() => setOpenStartDatePicker(false)}
                onChangeStartDate={(date) => {
                    setStartedDate(date)
                    setOpenStartDatePicker(false)
                }}
            />

            {RenderAreasCodesModal()}

            <View style={{ padding: 16 }}>
                <Button
                    title="Continue"
                    filled
                    style={{ marginTop: 12 }}
                    onPress={handleEditProfile}
                    isLoading={isLoading}
                />
            </View>

            {renderModal()}
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
    avatarContainer: {
        marginVertical: 12,
        alignItems: 'center',
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    avatar: {
        height: 130,
        width: 130,
        borderRadius: 65,
    },
    pickImage: {
        height: 42,
        width: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        borderColor: COLORS.greyscale500,
        borderWidth: 0.4,
        borderRadius: 12,
        height: 52,
        width: SIZES.width - 32,
        alignItems: 'center',
        marginVertical: 12,
        backgroundColor: COLORS.greyscale500,
    },
    downIcon: {
        width: 10,
        height: 10,
        tintColor: '#111',
    },
    selectFlagContainer: {
        width: 90,
        height: 50,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    flagIcon: {
        width: 30,
        height: 30,
    },
    input: {
        flex: 1,
        marginVertical: 10,
        height: 40,
        fontSize: 14,
        color: '#111',
    },
    inputBtn: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: COLORS.greyscale500,
        height: 52,
        paddingLeft: 8,
        fontSize: 18,
        justifyContent: 'space-between',
        marginTop: 4,
        backgroundColor: COLORS.greyscale500,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 32,
        right: 16,
        left: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: SIZES.width - 32,
        alignItems: 'center',
    },
    continueButton: {
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    closeBtn: {
        width: 42,
        height: 42,
        borderRadius: 999,
        backgroundColor: COLORS.white,
        position: 'absolute',
        right: 16,
        top: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },

    modalSubContainer: {
        height: 494,
        width: SIZES.width * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    modalIllustration: {
        height: 180,
        width: 180,
        marginVertical: 22,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.black2,
        textAlign: 'center',
        marginVertical: 12,
    },
})

export default FillYourProfile
