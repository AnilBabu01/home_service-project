import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Linking,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, icons, images } from '../constants'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '../theme/ThemeProvider'
import { io } from 'socket.io-client'
import {
    useSendMessageMutation,
    useGetMessagesQuery,
} from '../redux/serverinstance'
import { useFocusEffect } from '@react-navigation/native'

const socket = io('https://api.andamanhub.in')

const Chat = ({ navigation, route }) => {
    const { item } = route.params
    const [inputMessage, setInputMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [sendmessage] = useSendMessageMutation()
    const {
        data,
        isLoading: isMessageLoading,
        refetch,
    } = useGetMessagesQuery({
        chatId: item?.roomId,
        page,
        limit,
    })

    const { colors, dark } = useTheme()

    console.log('datass  ', messages)

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [item?.roomId, page, limit])
    )

    useEffect(() => {
        if (data?.data) {
            const newMessages = data?.data?.map((msg) => ({
                _id: msg.id,
                text: msg.message,
                createdAt: new Date(msg.createdAt),
                user: msg.provider
                    ? {
                          _id: 2,
                          name: msg.provider.name,
                          avatar: msg.provider?.profile,
                      }
                    : {
                          _id: 1,
                          name: msg.user.fullname,
                          avatar: msg.user.profile,
                      },
            }))

            setMessages((prev) => [...prev, ...newMessages])
        }
    }, [data?.data])

    useEffect(() => {
        if (!item?.roomId) return
        socket.on(item?.roomId, (message) => {
            const formattedMessage = {
                _id: message.id,
                text: message.message,
                createdAt: new Date(message.createdAt),
                user: message.provider
                    ? {
                          _id: 2,
                          name: message.provider.name,
                          avatar: images?.profile,
                      }
                    : {
                          _id: 1,
                          name: message.user?.fullname || 'Unknown',
                          avatar: images?.profile,
                      },
            }

            console.log('message from soket', message)

            setMessages((prev) => [formattedMessage, ...prev])

              console.log('message from soket', formattedMessage)
        })

        return () => socket.off(item?.roomId)
    }, [item?.roomId])


    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') return

        const message = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 },
        }

        // setMessages((prev) => [message, ...prev])

        setInputMessage('')

        try {
            await sendmessage({
                roomId: item?.roomId,
                message: inputMessage,
                type: 'user',
            }).unwrap()
        } catch (err) {
            console.error('Sending message error', err)
        }
    }

    const handleCallPress = () => {
        const phoneNumber = `tel:${item?.service?.provider?.mobile_no ?? '123456789'}`
        Linking.openURL(phoneNumber).catch((err) =>
            console.error('Dialer error', err)
        )
    }

    const loadMore = () => {
        setPage((prev) => prev + 1)
    }

    const renderItem = ({ item }) => {
        const isMe = item.user._id === 1

        console.log('ss', item)

        return (
            <View
                style={{
                    flexDirection: isMe ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    marginVertical: 6,
                    marginHorizontal: 12,
                }}
            >
                {!isMe && (
                    <Image
                        source={
                            item.user.avatar
                                ? { uri: item.user.avatar }
                                : images.default10
                        }
                        style={{ width: 35, height: 35, borderRadius: 18 }}
                    />
                )}

                <View
                    style={{
                        backgroundColor: isMe
                            ? COLORS.primary
                            : COLORS.secondary,
                        marginHorizontal: 8,
                        padding: 10,
                        borderRadius: 16,
                        maxWidth: '75%',
                    }}
                >
                    <Text style={{ color: COLORS.white }}>{item.text}</Text>
                    <Text
                        style={{
                            fontSize: 10,
                            color: COLORS.white,
                            marginTop: 4,
                            textAlign: 'right',
                        }}
                    >
                        {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View
                style={[
                    styles.header,
                    { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                ]}
            >
                <View style={[styles.providerContainer]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.arrowLeft}
                            style={styles.headerIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {item?.provider?.name || item?.service?.provider?.name}
                    </Text>
                </View>

                <TouchableOpacity onPress={handleCallPress}>
                    <Image source={icons.call} style={styles.headerIcon} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={90}
            >
                {isMessageLoading && (
                    <ActivityIndicator
                        size="small"
                        color={COLORS.primary}
                        style={{ margin: 10 }}
                    />
                )}

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderItem}
                    inverted
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />

                {data?.extraData?.isChatPaused ? (
                    <View style={[styles.chattingpauseContainer]}>
                        <Text>Chat paused for this booking</Text>
                    </View>
                ) : (
                    <View
                        style={[
                            styles.inputContainer,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark1
                                    : COLORS.white,
                            },
                        ]}
                    >
                        <TextInput
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            placeholder="Enter your message..."
                            placeholderTextColor={COLORS.grey}
                            style={[
                                styles.input,
                                {
                                    color: dark ? COLORS.white : COLORS.black,
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : COLORS.grayscale100,
                                },
                            ]}
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSendMessage}
                        >
                            <MaterialCommunityIcons
                                name="send"
                                size={24}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    headerTitle: {
        fontSize: 18,
        fontFamily: 'semiBold',
        marginLeft: 10,
    },
    headerIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius: 20,
        fontSize: 16,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 10,
    },
    providerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    chattingpauseContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
})

export default Chat
