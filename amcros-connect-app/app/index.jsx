import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  Image, 
  StyleSheet,
  Platform,
  SafeAreaView
} from "react-native";
import { auth, db } from "./../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";

const primaryColor = "#f43e17";

export default function LandingScreen() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await getDoc(doc(db, 'users', user?.email));
          if (res.exists()) {
            setUserDetail(res.data());
            router.replace('/(tabs)/Home');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>A</Text>
          </View>
        </View>
        
        {/* Heading */}
        <Text style={styles.title}>Amcros</Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>Seamless B2B ordering.</Text>
        
        {/* Description */}
        <Text style={styles.description}>
          Order directly from the manufacturer with ease.
        </Text>
        
        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={styles.decorativeItem}>
            <Feather name="box" size={24} color={primaryColor} />
            <Text style={styles.decorativeText}>Quality Products</Text>
          </View>
          
          <View style={styles.decorativeDivider} />
          
          <View style={styles.decorativeItem}>
            <Feather name="truck" size={24} color={primaryColor} />
            <Text style={styles.decorativeText}>Fast Delivery</Text>
          </View>
          
          <View style={styles.decorativeDivider} />
          
          <View style={styles.decorativeItem}>
            <Feather name="shield" size={24} color={primaryColor} />
            <Text style={styles.decorativeText}>Secure Ordering</Text>
          </View>
        </View>
      </View>
      
      {/* Button Container */}
      <View style={styles.buttonContainer}>
        {/* Get Started Button */}
        <TouchableOpacity 
          onPress={() => router.push('/auth/signUp')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity 
          onPress={() => router.push('/auth/signIn')}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footerText}>© 2023 Amcros. All rights reserved.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 20,
    color: "#555555",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  decorativeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  decorativeItem: {
    alignItems: "center",
    flex: 1,
  },
  decorativeText: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
  },
  decorativeDivider: {
    height: 30,
    width: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 10,
  },
  buttonContainer: {
    width: "85%",
    alignSelf: "center",
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: primaryColor,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 14,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  }
});