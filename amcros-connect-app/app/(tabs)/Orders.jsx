"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet, Platform, SafeAreaView } from "react-native"
import { Feather } from "@expo/vector-icons"

const primaryColor = "#f43e17"

// Dummy orders data
const initialOrders = [
  {
    id: "1",
    orderNumber: "ORD-2023-001",
    date: "2023-11-15",
    status: "Delivered",
    items: [
      {
        id: "1a",
        name: "Premium Cotton Socks",
        variant: "Black / Large",
        price: 12.99,
        quantity: 2,
      },
      {
        id: "1b",
        name: "Sports Performance Socks",
        variant: "White / Medium",
        price: 9.99,
        quantity: 1,
      },
    ],
    total: 35.97,
    shippingAddress: "123 Main St, Anytown, CA 12345",
  },
  {
    id: "2",
    orderNumber: "ORD-2023-002",
    date: "2023-12-01",
    status: "Processing",
    items: [
      {
        id: "2a",
        name: "Casual Striped Socks",
        variant: "Blue / Medium",
        price: 7.99,
        quantity: 3,
      },
    ],
    total: 23.97,
    shippingAddress: "456 Oak Ave, Somewhere, NY 67890",
  },
  {
    id: "3",
    orderNumber: "ORD-2023-003",
    date: "2023-12-10",
    status: "Shipped",
    items: [
      {
        id: "3a",
        name: "Premium Cotton Socks",
        variant: "Gray / Medium",
        price: 12.99,
        quantity: 1,
      },
      {
        id: "3b",
        name: "Sports Performance Socks",
        variant: "Black / Large",
        price: 9.99,
        quantity: 2,
      },
    ],
    total: 32.97,
    shippingAddress: "789 Pine Rd, Elsewhere, TX 54321",
  },
]

const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState(initialOrders)
  const [expandedOrder, setExpandedOrder] = useState(null)

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#4caf50"
      case "Processing":
        return "#2196f3"
      case "Shipped":
        return "#ff9800"
      case "Cancelled":
        return "#f44336"
      default:
        return "#9e9e9e"
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#e8f5e9"
      case "Processing":
        return "#e3f2fd"
      case "Shipped":
        return "#fff3e0"
      case "Cancelled":
        return "#ffebee"
      default:
        return "#f5f5f5"
    }
  }

  const renderOrderItem = (item) => (
    <View key={item.id} style={styles.orderItem}>
      <View style={styles.productImage}>
        <Feather name="box" size={24} color="#ccc" />
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productVariant}>{item.variant}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
      </View>
    </View>
  )

  const renderOrder = (order) => {
    const isExpanded = expandedOrder === order.id

    return (
      <View key={order.id} style={styles.orderContainer}>
        <TouchableOpacity style={styles.orderHeader} onPress={() => toggleOrderDetails(order.id)} activeOpacity={0.7}>
          <View>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.orderDate}>Order Date: {order.date}</Text>
          </View>

          <View style={styles.orderHeaderRight}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(order.status) }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
            </View>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#777"
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.orderDetails}>
            <View style={styles.orderItemsContainer}>
              <Text style={styles.sectionTitle}>Order Items</Text>
              {order.items.map((item) => renderOrderItem(item))}
            </View>

            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${(order.total * 0.92).toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8%)</Text>
                <Text style={styles.summaryValue}>${(order.total * 0.08).toFixed(2)}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.shippingContainer}>
              <Text style={styles.sectionTitle}>Shipping Address</Text>
              <Text style={styles.shippingAddress}>{order.shippingAddress}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.trackButton}>
                <Text style={styles.trackButtonText}>Track Order</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buyAgainButton}>
                <Text style={styles.buyAgainButtonText}>Buy Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    )
  }

  const renderEmptyOrders = () => (
    <View style={styles.emptyOrdersContainer}>
      <View style={styles.emptyOrdersIcon}>
        <Feather name="shopping-bag" size={50} color="#ccc" />
      </View>
      <Text style={styles.emptyOrdersTitle}>No orders yet</Text>
      <Text style={styles.emptyOrdersSubtitle}>
        You haven't placed any orders yet. Start shopping to see your orders here.
      </Text>
      <TouchableOpacity style={styles.shopNowButton}>
        <Text style={styles.shopNowButtonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      {/* Header */}
      <View
        style={{
          backgroundColor: primaryColor,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <SafeAreaView style={{ backgroundColor: primaryColor }}>
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
              Orders
            </Text>
            <TouchableOpacity>
              <Feather name="shopping-cart" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {orders.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {orders.map((order) => renderOrder(order))}
        </ScrollView>
      ) : (
        renderEmptyOrders()
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: primaryColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    paddingHorizontal: 20,
    height: 70, // Match Home screen height
    justifyContent: 'center', // Vertically center content
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 25,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: 'center', // Center the title
    width: '100%', // Take full width
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  orderContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: "hidden",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#777",
  },
  orderHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  expandIcon: {
    marginLeft: 4,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  orderItemsContainer: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  productVariant: {
    fontSize: 13,
    color: "#777",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: primaryColor,
    marginBottom: 2,
  },
  quantityText: {
    fontSize: 13,
    color: "#777",
  },
  orderSummary: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: primaryColor,
  },
  shippingContainer: {
    marginBottom: 20,
  },
  shippingAddress: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 8,
  },
  trackButtonText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
  },
  buyAgainButton: {
    flex: 1,
    backgroundColor: primaryColor,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginLeft: 8,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buyAgainButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyOrdersIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyOrdersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptyOrdersSubtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  shopNowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default Orders

