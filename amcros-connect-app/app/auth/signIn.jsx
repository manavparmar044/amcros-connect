import { Text, TextInput, View, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function signIn() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSignIn = async () => {
    setLoading(true);
    signInWithEmailAndPassword(auth,email,password)
    .then(async (res) => {
      const user = res.user
      console.log("User from here ", user);
      await getUserDetails()
    })
    .catch(err => {
      console.log(err);
    })
  };

  const getUserDetails = async () => {
    try {
      const res = await getDoc(doc(db, 'users', email));
      console.log(res.data());
      setUserDetail(res.data())
      router.replace('/(tabs)/Home')
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
      }}
    >
      {/* Logo */}
      <Image
    source={{
      uri: "https://res.cloudinary.com/ds4z0fqxi/image/upload/v1744556861/amcros-connect/amcros-logo_wfvljv.png",
    }}
    style={{
      width: 120,
      height: 120,
      resizeMode: "contain",
      marginBottom: 20,
    }}
  />

      {/* Input Fields */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Sign In Button */}
      <TouchableOpacity onPress={onSignIn} style={styles.primaryButton} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>

      {/* Navigation to Signup */}
      <Text onPress={() => router.push("./signUp")} style={styles.linkText}>
        Don’t have an account?{" "}
        <Text style={{ fontWeight: "bold", color: "#f43e17" }}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = {
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#f43e17",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
};
