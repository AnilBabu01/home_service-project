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
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { COLORS, SIZES, FONTS, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { launchImagePicker } from '../utils/ImagePickerHelper'
import Input from '../components/Input'
import { getFormatedDate } from 'react-native-modern-datepicker'
import DatePickerModal from '../components/DatePickerModal'
import Button from '../components/Button'
import RNPickerSelect from 'react-native-picker-select'
import { useTheme } from '../theme/ThemeProvider'
import {
    useEditProfileMutation,
    useGetProfileQuery,
} from '../redux/serverinstance'
import { showToast } from '../utils/showToast.js'

const isTestMode = true

const initialState = {
    inputValues: {
        fullName: isTestMode ? 'John Doe' : '',
        email: isTestMode ? 'example@gmail.com' : '',
        nickname: isTestMode ? '' : '',
        phoneNumber: '',
    },
    inputValidities: {
        fullName: false,
        email: false,
        nickname: false,
        phoneNumber: false,
    },
    formIsValid: false,
}

const EditProfile = ({ navigation }) => {
    const { data: isProfile } = useGetProfileQuery()
    const [editprofile, { isSuccess, isError, isLoading }] =
        useEditProfileMutation()
    const [image, setImage] = useState(null)
    const [error, setError] = useState()
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [areas, setAreas] = useState([])

    const [modalVisible, setModalVisible] = useState(false)
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
    const [profile, setprofile] = useState()
    const { colors, dark } = useTheme()

    const [selectedGender, setSelectedGender] = useState('')
    const [email, setEmail] = useState('')
    const [fullname, setFullname] = useState('')
    const [nickname, setNickname] = useState('')
    const [startedDate, setStartedDate] = useState()
    const [occupation, setOccupation] = useState('')
    const [mobileno, setMobileno] = useState('')

    const [selectedArea, setSelectedArea] = useState(null)

    useEffect(() => {
        if (isProfile) {
            setprofile(isProfile?.user)
            setFullname(isProfile?.user?.fullname)
            setEmail(isProfile?.user?.email)
            setNickname(isProfile?.user?.nickname)
            setStartedDate(isProfile?.user?.dob)
            setSelectedGender(isProfile?.user?.gender)
            setOccupation(isProfile?.user?.occupation)
            setMobileno(isProfile?.user?.mobileno)
            if (isProfile?.user?.countryCode) {
                setSelectedArea(JSON.parse(isProfile?.user?.countryCode))
                setAreas(JSON.parse(isProfile?.user?.countryCode))
            }
        } else {
            selectedArea({
                callingCode: '+91',
                code: 'IN',
                flag: 'https://flagsapi.com/IN/flat/64.png',
                item: 'India',
            })
            setAreas({
                callingCode: '+91',
                code: 'IN',
                flag: 'https://flagsapi.com/IN/flat/64.png',
                item: 'India',
            })
        }
    }, [isProfile])

    console.log('selectedArea', selectedArea)

    const handleEditProfile = async () => {
        try {
            const formData = new FormData()
            formData.append('fullname', fullname)
            formData.append('email', email)
            formData.append('nickname', nickname)
            formData.append('dob', startedDate)
            formData.append('gender', selectedGender)
            formData.append('occupation', occupation)
            formData.append('mobileno', mobileno)
            formData.append('countryCode', JSON.stringify(selectedArea))

            if (image) {
                formData.append('profile', {
                    uri: image.uri,
                    name: 'upload.jpg',
                    type: 'image/jpeg',
                })
            }

            const res = await editprofile(formData).unwrap()

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
            navigation.navigate('Profile')
        }
    }, [isSuccess])

    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ]

    const handleGenderChange = (value) => {
        setSelectedGender(value)
    }

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker)
    }

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error])

    const pickImage = async () => {
        try {
            const tempUri = await launchImagePicker()

            if (!tempUri) return

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
            })
    }, [])

    


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
                                height: 400,
                                width: SIZES.width * 0.8,
                                backgroundColor: COLORS.primary,
                                borderRadius: 12,
                            }}
                        >
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
                style={[
                    styles.area,
                    { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                ]}
            >
                <View
                    style={[
                        styles.container,
                        { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                    ]}
                >
                    <Header title="Edit Profile" />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={100} // Adjust as needed depending on header height
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View
                                style={{
                                    alignItems: 'center',
                                    marginVertical: 12,
                                }}
                            >
                                <View style={styles.avatarContainer}>
                                    <Image
                                        source={
                                            profile?.profile
                                                ? {
                                                      uri: `${profile?.profile}`,
                                                  }
                                                : image
                                                  ? image
                                                  : images?.default10
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

                            <View>
                                <Input
                                    id="fullName"
                                    onInputChanged={(id, text) =>
                                        setFullname(text)
                                    }
                                    value={fullname}
                                    placeholder="Full Name"
                                    placeholderTextColor={
                                        dark ? COLORS.grayTie : COLORS.black
                                    }
                                />
                                <Input
                                    id="Nickname"
                                    onInputChanged={(id, text) =>
                                        setNickname(text)
                                    }
                                    value={nickname}
                                    placeholder="Nickname"
                                    placeholderTextColor={
                                        dark ? COLORS.grayTie : COLORS.black
                                    }
                                />

                                <Input
                                    id="email"
                                    onInputChanged={(id, text) =>
                                        setEmail(text)
                                    }
                                    value={email}
                                    placeholder="Nickname"
                                    placeholderTextColor={
                                        dark ? COLORS.grayTie : COLORS.black
                                    }
                                />

                                <View
                                    style={{
                                        width: SIZES.width - 32,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[
                                            styles.inputBtn,
                                            {
                                                backgroundColor: dark
                                                    ? COLORS.dark2
                                                    : COLORS.greyscale500,
                                                borderColor: dark
                                                    ? COLORS.dark2
                                                    : COLORS.greyscale500,
                                            },
                                        ]}
                                        onPress={handleOnPressStartDate}
                                    >
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                color: COLORS.grayscale400,
                                            }}
                                        >
                                            {startedDate}
                                        </Text>
                                        <Feather
                                            name="calendar"
                                            size={24}
                                            color={COLORS.grayscale400}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={[
                                        styles.inputContainer,
                                        {
                                            backgroundColor: dark
                                                ? COLORS.dark2
                                                : COLORS.greyscale500,
                                            borderColor: dark
                                                ? COLORS.dark2
                                                : COLORS.greyscale500,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        style={styles.selectFlagContainer}
                                        onPress={() => setModalVisible(true)}
                                    >
                                        <View
                                            style={{ justifyContent: 'center' }}
                                        >
                                            <Image
                                                source={icons.down}
                                                resizeMode="contain"
                                                style={styles.downIcon}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                marginLeft: 5,
                                            }}
                                        >
                                            <Image
                                                source={{
                                                    uri: selectedArea?.flag,
                                                }}
                                                contentFit="contain"
                                                style={styles.flagIcon}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                marginLeft: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: dark
                                                        ? COLORS.white
                                                        : '#111',
                                                    fontSize: 12,
                                                }}
                                            >
                                                {selectedArea?.callingCode}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Input
                                        id="mobileNo"
                                        onInputChanged={(id, text) =>
                                            setMobileno(text)
                                        }
                                        value={mobileno}
                                        placeholder="Enter your phone number"
                                        placeholderTextColor={
                                            dark ? COLORS.grayTie : COLORS.black
                                        }
                                        keyboardType="numeric"
                                        hideActive={true}
                                    />
                                </View>
                                <View>
                                    <RNPickerSelect
                                        placeholder={{
                                            label: 'Select',
                                            value: '',
                                        }}
                                        items={genderOptions}
                                        onValueChange={(value) =>
                                            handleGenderChange(value)
                                        }
                                        value={selectedGender}
                                        style={{
                                            inputIOS: {
                                                fontSize: 16,
                                                paddingHorizontal: 10,
                                                borderRadius: 4,
                                                color: COLORS.greyscale600,
                                                paddingRight: 30,
                                                height: 52,
                                                width: SIZES.width - 30,
                                                alignItems: 'center',
                                                backgroundColor: dark
                                                    ? COLORS.dark2
                                                    : COLORS.greyscale500,
                                                borderRadius: 16,
                                            },
                                            inputAndroid: {
                                                fontSize: 16,
                                                paddingHorizontal: 10,
                                                borderRadius: 8,
                                                color: COLORS.greyscale600,
                                                paddingRight: 30,
                                                height: 52,
                                                width: SIZES.width - 32,
                                                alignItems: 'center',
                                                backgroundColor: dark
                                                    ? COLORS.dark2
                                                    : COLORS.greyscale500,
                                                borderRadius: 16,
                                            },
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        marginBottom: '30%',
                                        marginTop: '4%',
                                    }}
                                >
                                    <Input
                                        id="occupation"
                                        onInputChanged={(id, text) =>
                                            setOccupation(text)
                                        }
                                        value={occupation}
                                        placeholder="Occupation"
                                        placeholderTextColor={
                                            dark ? COLORS.grayTie : COLORS.black
                                        }
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
                <DatePickerModal
                    open={openStartDatePicker}
                    // startDate={startDate}
                    selectedDate={startedDate}
                    onClose={() => setOpenStartDatePicker(false)}
                    onChangeStartDate={(date) => {
                        setStartedDate(date)
                        setOpenStartDatePicker(false)
                    }}
                />
                {RenderAreasCodesModal()}
                <View style={styles.bottomContainer}>
                    <Button
                        title="Update"
                        filled
                        style={styles.continueButton}
                        onPress={() => handleEditProfile()}
                        isLoading={isLoading}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
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
        borderRadius: 6,
        height: 52,
        width: SIZES.width - 32,
        alignItems: 'center',
        marginVertical: 16,
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
        height: 50,
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
    genderContainer: {
        flexDirection: 'row',
        borderColor: COLORS.greyscale500,
        borderWidth: 0.4,
        borderRadius: 6,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        marginVertical: 16,
        backgroundColor: COLORS.greyscale500,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderRadius: 4,
        color: COLORS.greyscale600,
        paddingRight: 30,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        backgroundColor: COLORS.greyscale500,
        borderRadius: 16,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderRadius: 8,
        color: COLORS.greyscale600,
        paddingRight: 30,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        backgroundColor: COLORS.greyscale500,
        borderRadius: 16,
    },
})

export default EditProfile
