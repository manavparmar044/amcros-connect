import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { auth, db } from "./../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LandingScreen() {
  const router = useRouter()
  const {userDetail,setUserDetail} = useContext(UserDetailContext)
  onAuthStateChanged(auth, async (user) => {
    if(user){
      console.log(user);
      const res = await getDoc(doc(db,'users',user?.email))
      setUserDetail(res.data())
      router.replace('/(tabs)/Home')
    }
  })
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
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#000000",
          marginBottom: 10,
        }}
      >
        Amcros
      </Text>

      <Text
        style={{
          fontSize: 18,
          color: "#666666",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Seamless B2B ordering.
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#000000",
          textAlign: "center",
          marginBottom: 70,
        }}
      >
        Order directly from the manufacturer with ease.
      </Text>

      {/* Button Container */}
      <View style={{ width: "80%" }}> 
        {/* Get Started Button */}
        <TouchableOpacity onPress={()=>router.push('/auth/signUp')}
          style={{
            backgroundColor: "#f43e17",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            width: "100%", // Ensure both buttons have the same width
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity onPress={()=>router.push('/auth/signIn')}
          style={{
            backgroundColor: "#000000",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            width: "100%", // Same width as the first button
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
