import { View, Text, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Home = () => {
    const primaryColor = "#f43e17";
    const router = useRouter()
    return (
        <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
          <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
    
          {/* Admin Header */}
          <View style={{ backgroundColor: primaryColor }}>
            <SafeAreaView>
              <View
                style={{
                  paddingVertical: 24,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
                  Admin Dashboard
                </Text>
                <TouchableOpacity onPress={() => router.push("./Account")}>
                  <Feather name="settings" size={26} color="#fff" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
    
          {/* Admin Content */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Welcome Admin!
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#777",
                marginBottom: 30,
                textAlign: "center",
              }}
            >
              Manage your products and orders from here.
            </Text>
    
            <View style={{ width: "100%" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: primaryColor,
                  paddingVertical: 16,
                  borderRadius: 12,
                  marginBottom: 18,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                }}
                onPress={() => router.push("../admin/ProductEdit")}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                  Manage Products
                </Text>
              </TouchableOpacity>
    
              <TouchableOpacity
                style={{
                  backgroundColor: primaryColor,
                  paddingVertical: 16,
                  borderRadius: 12,
                  marginBottom: 10,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                }}
                onPress={() => router.push("../admin/ViewOrders")}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                  Manage Orders
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
}

export default Home