import { Colors } from "@/shared/colors/Colors";
import HeaderWithActions from "@/shared/components/HeaderSet";
import HeaderLayout from "@/shared/components/MainHeaderLayout";
import { screens } from "@/shared/styles/styles";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Suggestions = () => {
  const [people, setPeople] = useState([
    {
      id: "1",
      name: "Sophia Miller",
      profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
      mutualFriends: 6,
      mutualFriendImages: [
        "https://randomuser.me/api/portraits/men/12.jpg",
        "https://randomuser.me/api/portraits/women/33.jpg",
        "https://randomuser.me/api/portraits/men/56.jpg",
      ],
    },
    {
      id: "2",
      name: "James Anderson",
      profilePic: "https://randomuser.me/api/portraits/men/41.jpg",
      mutualFriends: 3,
      mutualFriendImages: [
        "https://randomuser.me/api/portraits/women/21.jpg",
        "https://randomuser.me/api/portraits/men/40.jpg",
      ],
    },
    {
      id: "3",
      name: "Olivia Taylor",
      profilePic: "https://randomuser.me/api/portraits/women/72.jpg",
      mutualFriends: 8,
      mutualFriendImages: [
        "https://randomuser.me/api/portraits/men/15.jpg",
        "https://randomuser.me/api/portraits/women/29.jpg",
        "https://randomuser.me/api/portraits/men/46.jpg",
      ],
    },
    {
      id: "4",
      name: "Liam Martinez",
      profilePic: "https://randomuser.me/api/portraits/men/50.jpg",
      mutualFriends: 2,
      mutualFriendImages: [
        "https://randomuser.me/api/portraits/men/23.jpg",
        "https://randomuser.me/api/portraits/women/54.jpg",
      ],
    },
  ]);

  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const handleAddFriend = (id: string) => {
    setSentRequests((prev) => [...prev, id]);
  };

  const handleRemove = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setSentRequests((prev) => prev.filter((reqId) => reqId !== id));
  };

  const renderPerson = ({ item }: { item: (typeof people)[0] }) => {
    const isSent = sentRequests.includes(item.id);

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.profilePic }} style={styles.profilePic} />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>

          {item.mutualFriends > 0 && (
            <View style={styles.mutualRow}>
              <View style={styles.mutualPics}>
                {item.mutualFriendImages.slice(0, 3).map((uri, idx) => (
                  <Image
                    key={idx}
                    source={{ uri }}
                    style={[
                      styles.mutualPic,
                      { marginLeft: idx === 0 ? 0 : -10 },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.mutual}>
                {item.mutualFriends} mutual friend
                {item.mutualFriends > 1 ? "s" : ""}
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            {isSent ? (
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: "#ccc",
                    borderWidth: 1,
                    borderColor: "#bbb",
                  },
                ]}
              >
                <Text style={[styles.btnText, { color: "#555" }]}>
                  Cancel Request
                </Text>
              </View>
            ) : (
              <Pressable
                style={[styles.button, { backgroundColor: Colors.primary }]}
                onPress={() => handleAddFriend(item.id)}
              >
                <Text style={[styles.btnText, { color: "#fff" }]}>
                  Add Friend
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.button, { backgroundColor: "#E4E6EB" }]}
              onPress={() => handleRemove(item.id)}
            >
              <Text style={[styles.btnText, { color: "#000" }]}>Remove</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[screens.screen]}>
      <HeaderLayout noBorderRadius>
        <HeaderWithActions
          title="Suggestions"
          onBack={() => router.back()}
          onAction={() => router.push("/pet-owner/search")}
          actionIcon="search"
          centerTitle={true}
        />
      </HeaderLayout>

      <Text
        style={{
          fontFamily: "RobotoSemiBold",
          fontSize: 16,
          color: "#000",
          alignSelf: "flex-start",
          marginLeft: 15,
          marginBottom: 5,
          marginTop: 10,
        }}
      >
        Pet owner you may know
      </Text>

      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={renderPerson}
        contentContainerStyle={{ padding: 15, backgroundColor: "#fff" }}
      />
    </View>
  );
};

export default Suggestions;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "flex-start",
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: "RobotoSemiBold",
    color: "#000",
  },
  mutualRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 6,
  },
  mutualPics: {
    flexDirection: "row",
    marginRight: 6,
  },
  mutualPic: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  mutual: {
    fontSize: 13,
    fontFamily: "Roboto",
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    fontSize: 14,
    fontFamily: "RobotoSemiBold",
  },
});
