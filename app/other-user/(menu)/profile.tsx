import { Colors } from "@/shared/colors/Colors";
import HeaderWithActions from "@/shared/components/HeaderSet";
import HeaderLayout from "@/shared/components/MainHeaderLayout";
import ProfileSkeleton from "@/shared/components/ProfileSkeleton";
import { screens } from "@/shared/styles/styles";
import { Entypo, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PageProfile = () => {
  // const {
  //   id,
  //   name,
  //   profile,
  //   cover_photo,
  //   bio,
  //   isPage,
  //   isFollowing,
  //   sharesCount,
  // } = useLocalSearchParams<{
  //   id: string;
  //   name: string;
  //   profile: string;
  //   cover_photo: string;
  //   bio?: string;
  //   isPage: string;
  //   isFollowing: string;
  //   sharesCount?: string;
  //   image: string;
  // }>();

  // const [followingStatus, setFollowingStatus] = useState(
  //   isFollowing === "true"
  // );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const maxImagesToShow = 3;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const dummyProfile = {
    id: 1,
    name: "Happy Paws Pet Care",
    email: "contact@happypaws.com",
    phone_number: "09171234567",
    bio: "Professional pet care and grooming services 🐾",
    profile_photo: "https://randomuser.me/api/portraits/women/44.jpg",
    cover_photo: "https://picsum.photos/800/400",
    address: "123 Pet Street, Manila, Philippines",
    isOpen: true,
    following: 100,
    followers: 50,
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: dummyProfile.name,
      time: "1d ago",
      profileImage: dummyProfile.profile_photo,
      content:
        "Welcome to our page! 🐾 Professional care for your pets, always.",
      images: [
        "https://picsum.photos/400/300?random=1",
        "https://picsum.photos/400/300?random=2",
        "https://picsum.photos/400/300?random=3",
        "https://picsum.photos/400/300?random=4",
        "https://picsum.photos/400/300?random=5",
        "https://picsum.photos/400/300?random=6",
        "https://picsum.photos/400/300?random=7",
      ],
      likes: 10,
      liked: false,
      comments: [],
      showComments: false,
      newComment: "",
      shares: 2,
    },
  ]);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handleEditProfile = () => {
    router.push({
      pathname: "/pet-owner/(menu)/edit-profile",
      params: {
        name: dummyProfile.name,
        email: dummyProfile.email,
        phone_number: dummyProfile.phone_number,
        bio: dummyProfile.bio,
        profile_photo: dummyProfile.profile_photo,
        cover_photo: dummyProfile.profile_photo,
        isPage: true as unknown as string,
        isOpen: dummyProfile.isOpen ? "true" : "false",
        address: dummyProfile.address,
      },
    });
  };

  return (
    <View style={screens.screen}>
      <HeaderLayout noBorderRadius>
        <HeaderWithActions
          title={dummyProfile.name}
          onBack={() => router.back()}
          centerTitle={true}
          onAction={() => router.push("/pet-owner/search")}
          actionIcon="search"
        />
      </HeaderLayout>

      {loading ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileSkeleton />
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Cover Photo --- */}
          <View style={styles.coverPhoto}>
            <Image
              source={{ uri: dummyProfile.cover_photo }}
              style={styles.coverImage}
            />
          </View>

          {/* --- Profile Info --- */}
          <View style={styles.profileHeader}>
            <View style={styles.profilePhoto}>
              <Image
                source={{ uri: dummyProfile.profile_photo }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{dummyProfile.name}</Text>
              <Text style={styles.followers}>
                <Text style={{ fontWeight: "bold" }}>
                  {dummyProfile.followers}{" "}
                </Text>
                Followers,{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {dummyProfile.following}{" "}
                </Text>
                Following
              </Text>
              <Text style={styles.bio}>{dummyProfile.bio}</Text>
            </View>
          </View>

          {/* --- Action Buttons --- */}
          <View style={styles.actionWrapper}>
            <Pressable
              style={[styles.actionButton, { backgroundColor: Colors.primary }]}
              onPress={handleEditProfile}
            >
              <MaterialIcons name="edit" size={17} color="black" />
              <Text style={[styles.actionButtonText, { color: "black" }]}>
                Edit Profile
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: "#ddd", paddingHorizontal: 20 },
              ]}
              onPress={() => router.push("/pet-owner/acc-settings")}
            >
              <Entypo name="dots-three-vertical" size={17} color="black" />
            </Pressable>
          </View>

          {/* --- Tabs --- */}
          <View style={styles.tabsContainer}>
            {["posts", "about"].map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab as "posts" | "about")}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* --- Tab Content --- */}
          {activeTab === "posts" && (
            <View style={styles.postsSection}>
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>About</Text>
                <View style={styles.aboutRow}>
                  <MaterialIcons
                    name="location-on"
                    size={30}
                    color={Colors.primary}
                  />
                  <Text style={styles.aboutText}>{dummyProfile.address}</Text>
                </View>

                <View style={styles.aboutRow}>
                  <MaterialIcons
                    name="phone"
                    size={30}
                    color={Colors.primary}
                  />
                  <Text style={styles.aboutText}>
                    {dummyProfile.phone_number}
                  </Text>
                </View>
                <View style={styles.aboutRow}>
                  <MaterialIcons
                    name="email"
                    size={30}
                    color={Colors.primary}
                  />
                  <Text style={styles.aboutText}>{dummyProfile.email}</Text>
                </View>
                <View style={styles.aboutRow}>
                  <Octicons
                    name="clock-fill"
                    size={25}
                    color={Colors.primary}
                  />
                  <Text style={styles.aboutText}>
                    {dummyProfile.isOpen ? "Open" : "Closed"}
                  </Text>
                </View>
              </View>

              <View style={styles.addPost}>
                <Text
                  style={{
                    fontFamily: "RobotoSemiBold",
                    fontSize: 16,
                    color: "#000",
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                >
                  Add Post
                </Text>

                <Pressable
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginLeft: 10,
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 10,
                  }}
                  onPress={() => {
                    const routePath = "/pet-owner/(home)/post";

                    router.push({
                      pathname: routePath,
                      params: {
                        profile: dummyProfile.profile_photo,
                        name: dummyProfile.name,
                      },
                    });
                  }}
                >
                  <View
                    style={{
                      borderRadius: 30,
                      width: 50,
                      height: 50,
                      backgroundColor: "#ccc",
                    }}
                  >
                    <Image
                      source={{ uri: dummyProfile.profile_photo }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 30,
                      }}
                    />
                  </View>

                  <Text
                    style={{
                      flex: 1,

                      borderRadius: 10,
                      padding: 15,
                    }}
                    // placeholder="What's on your mind?"
                    // onPress={() => router.push("/pet-owner/(home)/post")}
                  >
                    What's on your mind?{" "}
                  </Text>
                  <MaterialIcons name="image" size={24} color={"green"} />
                </Pressable>
              </View>

              {posts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <Image
                      source={{ uri: post.profileImage }}
                      style={styles.postProfile}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.userName}>{post.user}</Text>
                      <Text style={styles.postTime}>{post.time}</Text>
                    </View>
                    <Entypo
                      name="dots-three-horizontal"
                      size={18}
                      color={Colors.gray}
                    />
                  </View>

                  <Text style={styles.postContent}>{post.content}</Text>

                  {/* Image Grid */}
                  {/* Post Image */}
                  {post.images && post.images.length > 0 ? (
                    <View style={styles.imageGrid}>
                      {post.images.slice(0, maxImagesToShow).map((img, idx) => {
                        const extraImages =
                          post.images.length - maxImagesToShow;
                        return (
                          <TouchableOpacity
                            key={idx}
                            style={styles.imageWrapper}
                            onPress={() => {
                              setSelectedPostImages(post.images);
                              setSelectedIndex(idx);
                              setImageModalVisible(true);
                            }}
                            activeOpacity={0.8}
                          >
                            <Image
                              source={{ uri: img }}
                              style={styles.gridImage}
                              resizeMode="cover"
                            />
                            {idx === maxImagesToShow - 1 && extraImages > 0 && (
                              <View style={styles.overlay}>
                                <Text style={styles.overlayText}>
                                  +{extraImages}
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : post.images && post.images.length > 0 ? (
                    <Image
                      source={{ uri: post.images[0] }}
                      style={styles.postImage}
                    />
                  ) : null}

                  {/* Post Footer */}
                  <View style={styles.postFooter}>
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => toggleLike(post.id)}
                    >
                      <Ionicons
                        name={post.liked ? "heart-sharp" : "heart-outline"}
                        size={23}
                        color={post.liked ? "red" : "black"}
                      />
                      <Text style={styles.countText}>{post.likes}</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionBtn}
                      onPress={() =>
                        console.log(`Open comments for post ${post.id}`)
                      }
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={20}
                        color="black"
                      />
                      <Text style={styles.countText}>
                        {post.comments.length}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => console.log(`Shared post ${post.id}`)}
                    >
                      <Image
                        source={require("../../../assets/images/share.png")}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text style={styles.countText}>{post.shares}</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === "about" && (
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About</Text>
              <View style={styles.aboutRow}>
                <MaterialIcons
                  name="location-on"
                  size={30}
                  color={Colors.primary}
                />
                <Text style={styles.aboutText}>{dummyProfile.address}</Text>
              </View>

              <View style={styles.aboutRow}>
                <MaterialIcons name="phone" size={30} color={Colors.primary} />
                <Text style={styles.aboutText}>
                  {dummyProfile.phone_number}
                </Text>
              </View>
              <View style={styles.aboutRow}>
                <MaterialIcons name="email" size={30} color={Colors.primary} />
                <Text style={styles.aboutText}>{dummyProfile.email}</Text>
              </View>
              <View style={styles.aboutRow}>
                <Octicons name="clock-fill" size={25} color={Colors.primary} />
                <Text style={styles.aboutText}>
                  {dummyProfile.isOpen ? "Open" : "Closed"}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Image Modal */}
      {imageModalVisible && (
        <Modal visible={imageModalVisible} transparent={true}>
          <View style={styles.modalBackground}>
            <FlatList
              data={selectedPostImages}
              horizontal
              pagingEnabled
              initialScrollIndex={selectedIndex}
              getItemLayout={(_, index) => ({
                length: Dimensions.get("window").width,
                offset: Dimensions.get("window").width * index,
                index,
              })}
              keyExtractor={(uri, i) => i.toString()}
              renderItem={({ item }) => (
                <View style={styles.fullImageWrapper}>
                  <Image
                    source={{ uri: item }}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PageProfile;

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, paddingBottom: 100 },
  coverPhoto: { width: "100%", height: 200, backgroundColor: "#ccc" },
  coverImage: { width: "100%", height: "100%", resizeMode: "cover" },
  profileHeader: {
    flexDirection: "column",
    marginTop: -70,
    paddingHorizontal: 10,
  },
  profilePhoto: {
    width: 130,
    height: 130,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  profileImage: { width: "100%", height: "100%", borderRadius: 70 },
  profileInfo: { marginLeft: 10, marginTop: 10 },
  name: { fontSize: 24, fontFamily: "RobotoSemiBold", color: "#000" },
  bio: { fontSize: 15, color: "#555", marginTop: 25, marginBottom: 10 },
  followers: { fontSize: 15, color: "#555", marginTop: 5 },
  actionWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 75,
  },
  actionButtonText: {
    fontSize: 14,
    color: "white",
    fontFamily: "RobotoSemiBold",
  },

  tabsContainer: {
    flexDirection: "row",
    marginLeft: 15,
    gap: 10,
    marginTop: 15,
    // marginBottom: 10,
  },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: { backgroundColor: Colors.primary },
  tabText: {
    fontSize: 15,
    color: "#000",
    fontFamily: "RobotoSemiBold",
  },
  activeTabText: { color: "#fff" },
  addPost: {
    width: "100%",
    paddingVertical: 5,
    backgroundColor: "#fff",
    marginTop: 5,
    marginBottom: 5,
  },
  postsSection: { marginTop: 10 },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  postHeader: { flexDirection: "row", alignItems: "center" },
  postProfile: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontWeight: "600", fontSize: 15 },
  postTime: { color: Colors.gray, fontSize: 12 },
  postContent: { marginVertical: 8, fontSize: 14, color: "#333" },
  postImage: { width: "100%", height: 200, borderRadius: 8 },
  postFooter: { flexDirection: "row", marginTop: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  countText: { marginLeft: 5, color: Colors.gray },

  /** Image Grid **/
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 10,
  },
  imageWrapper: {
    width: "32%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImageWrapper: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    borderRadius: 12,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 10,
  },
  closeText: {
    fontSize: 28,
    color: "white",
  },

  aboutSection: { padding: 15, borderBottomWidth: 1, borderColor: "#eee" },
  aboutTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  aboutRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  aboutText: { marginLeft: 10, fontSize: 15, color: "#333" },

  appointmentSection: { marginTop: 20, padding: 15 },
  setAppointmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  setAppointmentText: { fontSize: 15, color: Colors.primary },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 5,
  },
  sectionTitle: { fontSize: 17, fontWeight: "600" },
  appointmentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  appointmentPet: { fontSize: 16, fontWeight: "600" },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: { fontSize: 13, fontWeight: "600" },
  appointmentDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  appointmentDetail: { fontSize: 14, color: "#333" },
});
