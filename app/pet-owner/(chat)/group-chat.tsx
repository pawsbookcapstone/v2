import { Colors } from "@/shared/colors/Colors";
import HeaderLayout from "@/shared/components/MainHeaderLayout";
import { screens, ShadowStyle } from "@/shared/styles/styles";
import { TMessage } from "@/shared/Types/MessageType";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type GroupMessage = TMessage & {
  senderName?: string;
  senderAvatar?: string;
};

const GroupChat = () => {
  const { id, name, avatar } = useLocalSearchParams();

  const [messages, setMessages] = useState<GroupMessage[]>([
    {
      id: "1",
      text: "Hey team, ready for the meeting?",
      sender: "other",
      senderName: "Sophia",
      senderAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: "2",
      text: "Yes! Just reviewing the agenda now.",
      sender: "me",
    },
    {
      id: "3",
      text: "I’ll join in 5 minutes!",
      sender: "other",
      senderName: "Liam",
      senderAvatar: "https://randomuser.me/api/portraits/men/50.jpg",
    },
  ]);

  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: GroupMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newMessage: GroupMessage = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        sender: "me",
        text: "",
      };
      setMessages((prev) => [...prev, newMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: GroupMessage }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageRow,
          isMe
            ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" },
        ]}
      >
        {!isMe && item.senderAvatar && (
          <Image
            source={{ uri: item.senderAvatar }}
            style={styles.senderAvatar}
          />
        )}

        <View>
          {!isMe && item.senderName && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}

          <View
            style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
          >
            {item.text ? (
              <Text
                style={[
                  styles.bubbleText,
                  isMe ? styles.myText : styles.otherText,
                ]}
              >
                {item.text}
              </Text>
            ) : null}

            {item.image && (
              <Image source={{ uri: item.image }} style={styles.chatImage} />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[screens.screen, { backgroundColor: Colors.white }]}>
      {/* Header */}
      <HeaderLayout noBorderRadius height={75} bottomBorder>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={20} color="black" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image
              source={{ uri: avatar as string }}
              style={styles.groupAvatar}
            />
            <Text style={styles.groupName}>{name}</Text>
          </View>
        </View>
      </HeaderLayout>

      {/* Chat */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
              padding: 10,
            }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={{ color: "#aaa", fontSize: 14 }}>
                  No messages yet 👋
                </Text>
              </View>
            )}
          />

          {/* Input */}
          <View style={styles.inputRow}>
            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
              <MaterialIcons
                name="photo-camera"
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <MaterialIcons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    gap: 5,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  groupAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  senderName: {
    fontSize: 11,
    color: "#777",
    marginLeft: 4,
    marginBottom: 2,
  },

  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 12,
  },
  myBubble: {
    backgroundColor: Colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
    ...ShadowStyle,
  },
  otherBubble: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
    ...ShadowStyle,
  },
  bubbleText: {
    fontSize: 14,
  },
  myText: {
    color: "white",
  },
  otherText: {
    color: Colors.primary,
  },
  chatImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 0.3,
    borderTopColor: "#ddd",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  iconButton: {
    marginRight: 8,
  },
});
