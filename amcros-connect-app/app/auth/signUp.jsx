import { Text, TextInput, View, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { useContext, useState } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function signUp() {
    const router = useRouter()
    const [businessName,setBusinessName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [gstin,setGstin] = useState('')
    const {userDetail, setUserDetail} = useContext(UserDetailContext)

    const createNewAccount = () => {
        createUserWithEmailAndPassword(auth,email,password)
        .then(async(res) => {
            const user = res.user;
            console.log(user); //Save to database
            await saveUser(user)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const saveUser = async (user) => {
        const data = {
            businessName: businessName,
            email: email,
            gstin: gstin,
            uid: user?.uid
        }
        await setDoc(doc(db, "users", email), data);
        setUserDetail(data)
    }

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
      <View
        style={{
          width: 80,
          height: 80,
          backgroundColor: "#f43e17",
          marginBottom: 20,
          borderRadius: 10,
        }}
      />

      {/* Input Fields */}
      <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                style={styles.input}
            />
            <TextInput
                placeholder="GSTIN"
                value={gstin}
                onChangeText={setGstin}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

      {/* Create Account Button */}
      <TouchableOpacity onPress={createNewAccount} style={styles.primaryButton}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Navigation to Login */}
      <Text onPress={()=>router.push('./signIn')} style={styles.linkText}>
        Already have an account? <Text style={{ fontWeight: "bold" }}>Sign in</Text>
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
