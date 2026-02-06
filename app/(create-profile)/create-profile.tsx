// creatProfile.tsx
import { useAppContext } from "@/AppsProvider";
import { add } from "@/helpers/db";
import { Colors } from "@/shared/colors/Colors";
import HeaderWithActions from "@/shared/components/HeaderSet";
import HeaderLayout from "@/shared/components/MainHeaderLayout";
import { screens } from "@/shared/styles/styles";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { serverTimestamp } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORIES = [
  "Dog Owner",
  "Cat Owner",
  "Veterinarian",
  "Grooming",
  "Adoption",
  "Training",
  "Pet Sitter",
  "Nutrition",
  "Pet Supplies",
];

const CreateProfile: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const { userId } = useAppContext();
  const [pageName, setPageName] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [allowAppointments, setAllowAppointments] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const openImagePicker = async (type: "profile") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri; // ✅ NOW DEFINED
      setProfileImage(imageUri);
    }
  };

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label],
    );
  };

  const canProceedToNext = useMemo(() => {
    if (step === 1) return pageName.trim().length > 0;
    if (step === 2) return selectedCategories.length > 0;
    return true;
  }, [step, pageName, selectedCategories]);

  const next = () => {
    setError(null);
    if (!canProceedToNext) {
      setError(
        step === 1
          ? "Please enter a page name."
          : "Select at least one category.",
      );
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const prev = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleCreate = () => {
    if (pageName.trim().length === 0) {
      setError("Please enter a page name.");
      setStep(1);
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Select at least one category.");
      setStep(2);
      return;
    }

    const payload = {
      name: pageName.trim(),
      categories: selectedCategories,
      allow_appointments: allowAppointments,
      profile: profileImage,
      created_at: serverTimestamp(),
      ownerId: userId,
    };

    add("pages").value(payload);

    // TODO: replace this with your API / store logic
    console.log("Created profile:", payload);

    Alert.alert(
      "Profile created",
      `"${payload.name}" has been created with ${payload.categories.length} category(ies).`,
      [
        {
          text: "OK",
          onPress: () => {
            // return to previous screen (or change to your desired route)
            router.back();
          },
        },
      ],
    );
  };

  return (
    <View style={screens.screen}>
      <HeaderLayout noBorderRadius bottomBorder>
        <HeaderWithActions
          title="Create Profile"
          onBack={() => router.back()}
          centerTitle
        />
      </HeaderLayout>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Step indicator */}
        <View style={styles.stepsRow}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
            <Text
              style={[
                styles.stepDotText,
                step >= 1 && styles.stepDotTextActive,
              ]}
            >
              1
            </Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
            <Text
              style={[
                styles.stepDotText,
                step >= 2 && styles.stepDotTextActive,
              ]}
            >
              2
            </Text>
          </View>

          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]}>
            <Text
              style={[
                styles.stepDotText,
                step >= 3 && styles.stepDotTextActive,
              ]}
            >
              3
            </Text>
          </View>

          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 4 && styles.stepDotActive]}>
            <Text
              style={[
                styles.stepDotText,
                step >= 4 && styles.stepDotTextActive,
              ]}
            >
              4
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <View style={styles.stepCard}>
              <Text style={styles.stepTitle}>1. Fill a Page Name</Text>
              <TextInput
                placeholder="e.g. John's Dog Care"
                value={pageName}
                onChangeText={setPageName}
                style={styles.input}
                maxLength={50}
                returnKeyType="done"
                accessible
                accessibilityLabel="Page name input"
              />

              <Pressable
                style={styles.toggleRow}
                onPress={() => setAllowAppointments((prev) => !prev)}
              >
                <FontAwesome
                  name={allowAppointments ? "check-square" : "square-o"}
                  size={20}
                  color={allowAppointments ? Colors.primary : "#888"}
                />
                <Text style={styles.toggleText}>Allow Appointments</Text>
              </Pressable>

              <Text style={styles.hint}>
                This name will appear on your PaswBook profile page.
              </Text>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepCard}>
              <Text style={styles.stepTitle}>2. Choose categories</Text>
              <Text style={styles.hint}>
                Pick categories related to pets or pet care (tap to toggle)
              </Text>

              <View style={styles.chipsWrap}>
                {CATEGORIES.map((c) => {
                  const selected = selectedCategories.includes(c);
                  return (
                    <Pressable
                      key={c}
                      onPress={() => toggleCategory(c)}
                      style={[
                        styles.chip,
                        selected ? styles.chipSelected : styles.chipUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selected && styles.chipTextSelected,
                        ]}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepCard}>
              <Text style={styles.stepTitle}>3. Profile Setup</Text>

              {/* Profile Photo */}
              <View style={styles.profilePhotoContainer}>
                <Pressable onPress={() => openImagePicker("profile")}>
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <FontAwesome
                      name="user-circle"
                      size={100}
                      color={Colors.gray}
                    />
                  )}

                  <View style={styles.profileEditIcon}>
                    <FontAwesome name="camera" size={16} color={Colors.white} />
                  </View>
                </Pressable>
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepCard}>
              <Text style={styles.stepTitle}>4. Review & Create</Text>

              {/* ✅ Profile Image Preview */}
              <View style={styles.reviewProfileContainer}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.reviewProfileImage}
                  />
                ) : (
                  <View style={styles.reviewProfilePlaceholder}>
                    <FontAwesome name="user" size={36} color={Colors.gray} />
                  </View>
                )}
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Page name</Text>
                <Text style={styles.reviewValue}>{pageName || "-"}</Text>
              </View>

              <View style={[styles.reviewRow, { alignItems: "flex-start" }]}>
                <Text style={styles.reviewLabel}>Categories</Text>
                <View style={styles.reviewCategories}>
                  {selectedCategories.length === 0 ? (
                    <Text style={styles.reviewValue}>
                      No categories selected
                    </Text>
                  ) : (
                    selectedCategories.map((c) => (
                      <View key={c} style={styles.reviewChip}>
                        <Text style={styles.reviewChipText}>{c}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>

              <Text style={styles.hint}>
                When you tap Create, the profile will be saved.
              </Text>
            </View>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Bottom controls */}
          <View style={styles.controls}>
            <Pressable
              onPress={prev}
              disabled={step === 1}
              style={[
                styles.controlBtn,
                step === 1 && styles.controlBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.controlBtnText,
                  step === 1 && styles.controlBtnTextDisabled,
                ]}
              >
                Back
              </Text>
            </Pressable>

            {step < 4 ? (
              <Pressable
                onPress={next}
                style={[
                  styles.primaryBtn,
                  !canProceedToNext && styles.primaryBtnDisabled,
                ]}
                disabled={!canProceedToNext}
              >
                <Text style={styles.primaryBtnText}>Next</Text>
              </Pressable>
            ) : (
              <Pressable onPress={handleCreate} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Create</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateProfile;

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background ?? "#fff",
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  stepDot: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  stepDotText: {
    fontFamily: "RobotoMedium",
    color: "#666",
  },
  stepDotTextActive: {
    color: "#fff",
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: "#eee",
    marginHorizontal: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
    marginBottom: 8,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: "Roboto",
    color: "#111",
  },

  stepCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: "RobotoMedium",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    fontFamily: "Roboto",
    color: "#111",
    backgroundColor: "#FAFAFA",
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    fontFamily: "Roboto",
  },

  chipsWrap: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipUnselected: {
    backgroundColor: "#fff",
    borderColor: "#E6E6E6",
  },
  chipText: {
    fontFamily: "Roboto",
    color: "#222",
  },
  chipTextSelected: {
    color: "#fff",
    fontFamily: "RobotoMedium",
  },

  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewLabel: {
    width: 110,
    fontFamily: "Roboto",
    color: "#666",
  },
  reviewValue: {
    flex: 1,
    fontFamily: "RobotoMedium",
    color: "#111",
  },
  reviewCategories: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  reviewChip: {
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  reviewChipText: {
    fontFamily: "Roboto",
    color: "#333",
    fontSize: 13,
  },

  error: {
    color: "#B00020",
    marginTop: 12,
    fontFamily: "Roboto",
    fontSize: 13,
    textAlign: "center",
  },

  controls: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  controlBtnDisabled: {
    opacity: 0.4,
  },
  controlBtnText: {
    color: "#333",
    fontFamily: "RobotoMedium",
  },
  controlBtnTextDisabled: {
    color: "#999",
  },

  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#fff",
    fontFamily: "RobotoMedium",
  },
  profilePhotoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // ✅ circular
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: "#f2f2f2",
  },

  profileEditIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  reviewProfileContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  reviewProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  reviewProfilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
});
