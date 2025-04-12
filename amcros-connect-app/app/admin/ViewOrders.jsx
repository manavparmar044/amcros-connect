import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Alert,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { Feather } from "@expo/vector-icons";
  import { collection, getDocs, query, doc, updateDoc } from "firebase/firestore";
  import { db } from "../../config/firebaseConfig";
  import { useRouter } from "expo-router";
  
  const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const primaryColor = "#f43e17";
    const router = useRouter();
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef);
          const querySnapshot = await getDocs(q);
  
          const allOrders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setOrders(allOrders);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        }
      };
  
      fetchOrders();
    }, []);
  
    const updateOrderStatus = async (orderId, currentStatus) => {
      const statusFlow = ["Pending", "Processing", "Dispatched", "Cancelled"];
      const nextStatusIndex =
        (statusFlow.indexOf(currentStatus) + 1) % statusFlow.length;
      const nextStatus = statusFlow[nextStatusIndex];
  
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: nextStatus });
  
        // Update local state too for instant UI feedback
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: nextStatus } : order
          )
        );
  
        Alert.alert("Status Updated", `Order status changed to ${nextStatus}`);
      } catch (err) {
        console.error("Failed to update status:", err);
        Alert.alert("Error", "Could not update order status.");
      }
    };
  
    const renderOrderItem = ({ item }) => (
      <View
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 12,
          marginVertical: 8,
          marginHorizontal: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 5,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>
          Order: {item.orderNumber || item.id}
        </Text>
  
        <Text style={{ color: "#555", marginBottom: 4 }}>Customer: {item.email}</Text>
  
        <Text style={{ color: "#333", fontWeight: "500", marginBottom: 6 }}>
          Total: ₹{item.total}
        </Text>
  
        {item.status && (
          <Text
            style={{
              color:
                item.status === "Completed"
                  ? "green"
                  : item.status === "Cancelled"
                  ? "red"
                  : primaryColor,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Status: {item.status}
          </Text>
        )}
  
        {/* Ordered Products List */}
        {item.items && item.items.length > 0 && (
          <View>
            <Text style={{ fontWeight: "600", marginBottom: 4 }}>Items:</Text>
            {item.items.map((prod, index) => (
              <View key={index} style={{ marginLeft: 6, marginBottom: 4 }}>
                <Text style={{ color: "#444" }}>
                  • {prod.name} ({prod.quantity} pcs) - ₹{prod.price}
                </Text>
              </View>
            ))}
          </View>
        )}
  
        <TouchableOpacity
          style={{
            backgroundColor: primaryColor,
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 12,
          }}
          onPress={() => updateOrderStatus(item.id, item.status)}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
            Change Status
          </Text>
        </TouchableOpacity>
      </View>
    );
  
    return (
      <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
        <View style={{ backgroundColor: primaryColor }}>
          <SafeAreaView>
            <View
              style={{
                paddingVertical: 20,
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
                View Orders
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
  
        {orders.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#777", fontSize: 16 }}>No orders found.</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    );
  };
  
  export default ViewOrders;
  