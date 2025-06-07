import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f43e17", // Set active icon color to orange
        tabBarInactiveTintColor: "#666", // Set inactive icon color
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Chat"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Orders"
        options={{
          tabBarIcon: ({ color, size }) => <Octicons name="package" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          tabBarIcon: ({ color, size }) => <AntDesign name="shoppingcart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="account-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
