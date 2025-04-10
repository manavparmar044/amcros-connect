import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  Animated,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { UserDetailContext } from '../../context/UserDetailContext';

const primaryColor = "#f43e17";

const OrderConfirmation = () => {
  const { orderDetails } = useLocalSearchParams();
  const router = useRouter();
  const parsedDetails = orderDetails ? JSON.parse(orderDetails) : null;
  console.log('Parsed Details:', parsedDetails);
  
  // States for order flow
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));
  
  // Generate order number
  const orderNumber = `AMC${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Calculate estimated delivery date (7 days from now)
  const deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const subtotal = parsedDetails?.subtotal ?? parsedDetails?.items?.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0) ?? 0;
  
  const shipping = parsedDetails?.shipping ?? Math.max(0, parsedDetails.total - subtotal); // Assuming tax is 0
  
  const tax = parsedDetails?.tax ?? 0;
  
  // Animation for success popup
  useEffect(() => {
    if (popupVisible) {
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        setPopupVisible(false);
      });
    }
  }, [popupVisible]);
  
  const scaleAnimation = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 1]
  });
  
  const opacityAnimation = animationValue.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1]
  });

  const { userDetail,setUserDetail } = useContext(UserDetailContext);

  // Handle place order
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
  
    try {
      const orderNumber = `AMC${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
      const orderData = {
        email: userDetail?.email,
        orderNumber,
        orderDate: new Date().toISOString(),
        estimatedDelivery: deliveryDate.toISOString(),
        items: parsedDetails.items,
        subtotal,
        shipping,
        tax,
        total: parsedDetails.total,
        paymentMethod: "Cash on Delivery",
        status: "Processing"
      };
  
      // 👇 This is the correct collection ref
      const orderRef = collection(db, "orders");
      await addDoc(orderRef, orderData); // Add to collection
  
      setOrderPlaced(true);
      setPopupVisible(true);
    } catch (err) {
      console.error("Error adding to orders collection:", err);
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {orderPlaced ? "Order Confirmation" : "Review Order"}
        </Text>
        
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {orderPlaced ? (
          // Order Confirmation View
          <>
            {/* Success Banner */}
            <View style={styles.successBanner}>
              <View style={styles.iconContainer}>
                <Feather name="check-circle" size={40} color="#fff" />
              </View>
              <Text style={styles.successTitle}>Order Placed Successfully!</Text>
              <Text style={styles.successMessage}>
                Thank you for your order. We'll process it right away.
              </Text>
            </View>
            
            {/* Order Details Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Order Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Number</Text>
                <Text style={styles.detailValue}>{orderNumber}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Date</Text>
                <Text style={styles.detailValue}>
                  {new Date().toLocaleDateString('en-IN')}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estimated Delivery</Text>
                <Text style={styles.detailValue}>{formattedDeliveryDate}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailValue}>Cash on Delivery</Text>
              </View>
            </View>
          </>
        ) : (
          // Order Review Banner
          <View style={styles.reviewBanner}>
            <View style={styles.iconContainer}>
              <Feather name="shopping-bag" size={40} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Review Your Order</Text>
            <Text style={styles.successMessage}>
              Please review your order details before confirming.
            </Text>
          </View>
        )}
        
        {/* Order Summary Card */}
        {parsedDetails && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            
            {/* Items List */}
            <View style={styles.itemsContainer}>
              {parsedDetails.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemVariant}>{item.variant}</Text>
                  </View>
                  <View style={styles.itemQuantity}>
                    <Text style={styles.quantityText}>x{item.quantity}</Text>
                  </View>
                  <View style={styles.itemPrice}>
                    <Text style={styles.priceText}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            
            {/* Price Summary */}
            <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
  <Text style={styles.priceLabel}>Subtotal</Text>
  <Text style={styles.priceValue}>
    ₹{isNaN(Number(subtotal)) ? '0.00' : Number(subtotal).toFixed(2)}
  </Text>
</View>

<View style={styles.priceRow}>
  <Text style={styles.priceLabel}>Tax</Text>
  <Text style={styles.priceValue}>
    ₹{isNaN(Number(tax)) ? '0.00' : Number(tax).toFixed(2)}
  </Text>
</View>

<View style={styles.priceRow}>
  <Text style={styles.priceLabel}>Shipping</Text>
  <Text style={styles.priceValue}>
    {isNaN(Number(parsedDetails?.shipping)) || Number(parsedDetails.shipping) === 0 
      ? 'Free' 
      : `₹${Number(parsedDetails.shipping).toFixed(2)}`}
  </Text>
</View>

              
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ₹{Number(parsedDetails.total || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Shipping Address Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shipping Address</Text>
          <Text style={styles.addressText}>
            123 Business Street{'\n'}
            Cityville, State 12345{'\n'}
            India
          </Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!orderPlaced ? (
            // Confirm Order Button
            <TouchableOpacity 
              style={[
                styles.primaryButton,
                isProcessing && styles.disabledButton
              ]}
              onPress={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.primaryButtonText}>Processing...</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>Confirm Order</Text>
              )}
            </TouchableOpacity>
          ) : (
            // Post-order buttons
            <>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => router.push('/Home')}
              >
                <Text style={styles.primaryButtonText}>Continue Shopping</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {/* Navigate to orders */}}
              >
                <Feather name="file-text" size={18} color="#555" style={styles.buttonIcon} />
                <Text style={styles.secondaryButtonText}>View All Orders</Text>
              </TouchableOpacity>
            </>
          )}
          
          {!orderPlaced && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Feather name="edit-2" size={18} color="#555" style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>Edit Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      
      {/* Success Popup */}
      {popupVisible && (
        <View style={styles.popupOverlay}>
          <Animated.View 
            style={[
              styles.popup,
              {
                opacity: opacityAnimation,
                transform: [{ scale: scaleAnimation }]
              }
            ]}
          >
            <View style={styles.popupIconContainer}>
              <Feather name="check" size={30} color="#fff" />
            </View>
            <Text style={styles.popupText}>Order Placed Successfully!</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: primaryColor,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  successBanner: {
    backgroundColor: primaryColor,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  reviewBanner: {
    backgroundColor: '#4a4a4a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 13,
    color: '#777',
  },
  itemQuantity: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    color: '#555',
  },
  itemPrice: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  priceSummary: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
  },
  addressText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#f4754a',
    shadowOpacity: 0.1,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '500',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  popup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  popupIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  popupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderConfirmation;