import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS, icons, images } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { io } from "socket.io-client";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/lib/react-query/serverinstamce";
import { width } from "../utils/responsuve";
import { formatTime } from "../utils/allFunctions";
import { useFocusEffect } from "@react-navigation/native";
const socket = io("https://api.andamanhub.in");

const Chat = () => {
  const router = useRouter();
  const [isData, setisData] = useState<any>();
  const { item, route } = useLocalSearchParams();
  const [messages, setMessages] = useState<any>([]);
  const [limit, setlimit] = useState(10);
  const [page, setpage] = useState(1);
  const [sendmessage, { isSuccess, isError, isLoading }] =
    useSendMessageMutation();

  const {
    data,
    refetch,
    error,
    isLoading: isMessageLoading,
  } = useGetMessagesQuery({
    chatId: isData?.roomId,
    page: page,
    limit: limit,
  });

  useFocusEffect(
    useCallback(() => {
      if (isData?.roomId) refetch();
    }, [isData?.roomId, page, limit])
  );

  console.log("messages  is messages refresh token ", data);
  
  useEffect(() => {
    if (typeof item === "string") {
      setisData(JSON.parse(item));
    } else {
      console.error("item is not a string:", item);
    }
  }, [item]);

  const loadMore = () => {
    setpage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (data?.data) {
      const formattedMessages = data?.data?.map((msg: any) => ({
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
              avatar: msg.user?.profile,
            },
      }));

      // Append new messages to the previous ones to avoid overwriting
      setMessages((prevMessages: any) => [
        ...prevMessages,
        ...formattedMessages,
      ]);
    }
  }, [data]);

  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (!isData?.roomId) return;

    socket.on(isData?.roomId, (message: any) => {
      const formattedMessage = {
        _id: message.id,
        text: message.message,
        createdAt: new Date(message.createdAt),
        user: message.provider
          ? {
              _id: 2,
              name: message.provider.name,
              avatar: message.provider?.profile,
            }
          : {
              _id: 1,
              name: message.user?.fullname || "Unknown",
              avatar: message.user?.profile,
            },
      };

      setMessages((prevMessages: any) => [formattedMessage, ...prevMessages]);
    });

    return () => {
      socket.off(isData?.roomId);
    };
  }, [isData?.roomId]);

  const handleCallPress = () => {
    const phoneNumber = `tel:${
      isData?.service?.provider?.mobile_no ?? "123456789"
    }`;
    Linking.openURL(phoneNumber).catch((err) =>
      console.error("Error opening dialer", err)
    );
  };

  const submitHandler = async () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 2 },
    };

    // setMessages((prevMessages: any) => [newMessage, ...prevMessages]);

    await sendmessage({
      roomId: isData.roomId,
      message: inputMessage,
      type: "provider",
    }).unwrap();

    setInputMessage("");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.arrowLeft} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isData?.user?.fullname}</Text>
          </View>

          <TouchableOpacity onPress={handleCallPress}>
            <Image source={icons.call} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={[...messages]}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          inverted
          renderItem={({ item }) => (
            <MessageItem message={item} currentUserId={1} />
          )}
          onEndReached={loadMore}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60 }}
        />

        {data?.extraData?.isChatPaused ? (
          <View style={[styles.chattingpauseContainer]}>
            <Text>Chat paused for this booking</Text>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Enter your message..."
              placeholderTextColor={COLORS.primary}
            />
            <TouchableOpacity onPress={submitHandler} style={styles.sendButton}>
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};
const MessageItem = ({
  message,
  currentUserId,
}: {
  message: any;
  currentUserId: number;
}) => {
  const isUserMessage = message.user._id !== currentUserId;

  console.log("message itme is", message);

  return (
    <View
      style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessage : styles.otherMessage,
      ]}
    >
      {!isUserMessage && (
        <Image
          source={
            message.user.avatar
              ? { uri: message.user.avatar }
              : images.default10
          }
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          isUserMessage ? styles.userBubble : styles.otherBubble,
        ]}
      >
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.timeText}>{formatTime(message?.createdAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginLeft: width * 0.03,
  },
  headerIcon: { height: 24, width: 24, tintColor: COLORS.black },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  userMessage: { justifyContent: "flex-end", flexDirection: "row" },
  otherMessage: { justifyContent: "flex-start", flexDirection: "row" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  messageBubble: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  userBubble: { backgroundColor: COLORS.primary, alignSelf: "flex-end" },
  otherBubble: { backgroundColor: COLORS.secondary, alignSelf: "flex-start" },
  messageText: { color: COLORS.white },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 10,
    borderTopWidth: 1,
    borderColor: COLORS.grayscale100,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.grayscale100,
    padding: 14,
    borderRadius: 12,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 100,
  },
  timeText: {
    color: COLORS.white,
    fontSize: 10,
  },
  chattingpauseContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: width * 0.02,
  },
});

export default Chat;
