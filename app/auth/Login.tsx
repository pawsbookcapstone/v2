import { useAppContext } from "@/AppsProvider";
import { LoadingButton } from "@/components/LoadingButton";

import { find, set } from "@/helpers/db";
import { auth } from "@/helpers/firebase";
import { Colors } from "@/shared/colors/Colors";
import { screens } from "@/shared/styles/styles";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const [email, setemail] = useState("email@gmail.com");
  const [password, setpassword] = useState("PASSWORD");
  //ad's account
  // const [email, setemail] = useState("adrianfegalan@gmail.com");
  // const [password, setpassword] = useState("PASSWORD");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    setUserId,
    setUserFirstName,
    setUserLastName,
    setUserEmail,
    setUserImagePath,
  } = useAppContext();

  const handleBack = () => {
    router.replace("/StartScreen");
  };

  const onLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const userDoc = await find("users", userCredential.user.uid);

      if (!userDoc.exists()) {
        await auth.signOut();
        Alert.alert("Error", "Account not found!!!");
        return;
      }

      //add this after this or in line 61- from edmar

      if (!userDoc.exists()) {
        await auth.signOut();
        Alert.alert("Error", "Account not found!!!");
        return;
      }
      set("users", userCredential.user.uid).value({ online: true });
      //until here
      const user = userDoc.data();
      setUserId(userCredential.user.uid);
      setUserFirstName(user.firstname);
      setUserLastName(user.lastname);
      setUserEmail(user.email);
      setUserImagePath(user.img_path);
      setLoading(false);
      router.replace({
        pathname: "/pet-owner/(tabs)/home",
        params: { imagepath: setUserImagePath },
      });
    } catch (e) {
      Alert.alert("Error", e + "");
      console.log(e);
      setLoading(false);
    }
  };

  const onSignUp = () => {
    router.replace("/auth/register");
  };

  return (
    <View style={screens.screen}>
      <View
        // onPress={handleBack}
        style={{ marginBottom: 10, marginTop: 55, marginLeft: 20 }}
      >
        {/* <MaterialIcons name="arrow-back-ios" size={24} color="black" /> */}
      </View>

      <Image
        source={require("../../assets/images/logo/headerlogo.png")}
        style={styles.logo}
      />
      <View style={styles.wrapper}>
        <Text style={styles.title}>Glad to see you again!</Text>
        <Text style={styles.subtitle}>log in to access your pets.</Text>
      </View>

      <View style={{ flexDirection: "column", gap: 5, marginTop: 35 }}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color={Colors.primary} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setemail}
            style={styles.input}
          />
        </View>
      </View>
      <View style={{ flexDirection: "column", gap: 5 }}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <FontAwesome5
            name="lock"
            size={20}
            color={Colors.primary}
            marginLeft={25}
          />

          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setpassword}
            style={[styles.input, { flex: 1 }]}
          />

          <TouchableOpacity
            disabled={password.length === 0}
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ padding: 5 }}
          >
            {password.length > 0 ? (
              <FontAwesome5
                name={showPassword ? "eye-slash" : "eye"}
                size={15}
                color="#ccc"
                marginRight={10}
              />
            ) : (
              <View style={{ width: 15 }} /> // placeholder keeps layout stable
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.forgotPassword}>Forgot password?</Text>

      {/* <Link href="/pet-owner/(tabs)/home" asChild> */}
      {/* <Pressable onPress={onLogin} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable> */}
      <LoadingButton
        title="Login"
        loading={loading}
        onPress={onLogin}
        style={styles.buttonContainer}
        textStyle={styles.buttonText}
      />

      {/* </Link> */}

      {/* <Link href="/auth/register" asChild> */}
      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Pressable onPress={onSignUp}>
          <Text
            style={{
              fontFamily: "RobotoMedium",
              fontSize: 15,
              color: Colors.primary,
            }}
          >
            Sign up
          </Text>
        </Pressable>
      </Text>
      {/* </Link> */}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "RobotoSemiBold",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Roboto",
  },
  wrapper: {
    flexDirection: "column",
    marginHorizontal: 20,
    marginTop: 80,
  },
  logo: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    width: 140,
    height: 20,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "white",
    borderWidth: 1.3,
    borderColor: Colors.primary,
    borderRadius: 24,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    height: 50,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: "Roboto",
    color: "#000",
    marginLeft: 30,
  },
  input: {
    borderRadius: 8,
    padding: 10,
    width: "80%",
    fontFamily: "Roboto",
    color: "#C3C0C0",
  },
  forgotPassword: {
    alignSelf: "center",
    fontFamily: "RobotoSemiBold",
    color: Colors.primary,
    marginTop: 20,
    fontSize: 13,
  },

  buttonContainer: {
    backgroundColor: Colors.primary,
    width: "80%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Sans",
  },

  signupText: {
    position: "absolute",
    bottom: 40,
    fontFamily: "Roboto",
    fontSize: 14,
    alignSelf: "center",
  },
});
