import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView,
  Platform
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const primaryColor = "#f43e17";

const Product = () => {
  const { name, image, price } = useLocalSearchParams();
  const router = useRouter();
  
  // State for pack size selection
  const [selectedPack, setSelectedPack] = useState(3);
  const [quantity, setQuantity] = useState(1);
  
  // Calculate price based on pack size
  const basePrice = parseInt(price);
  const packPrice = selectedPack === 3 ? basePrice : Math.round(basePrice * 1.2); // 20% more for pack of 5
  const totalPrice = packPrice * quantity;
  
  // Quantity handlers
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

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
        
        <Text style={styles.headerTitle}>Product Details</Text>
        
        <TouchableOpacity style={styles.cartButton}>
          <Feather name="shopping-cart" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <Image source={{ uri: image }} style={styles.image} />
        
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          
          {/* Category Tags */}
          <View style={styles.categoryContainer}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>Premium</Text>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>Socks</Text>
            </View>
          </View>
          
          <Text style={styles.description}>
            This is a beautifully crafted premium quality product designed for
            comfort and style. Made with high-quality materials that ensure durability
            and all-day comfort.
          </Text>
          
          {/* Pack Size Selection */}
          <Text style={styles.sectionTitle}>Select Pack Size</Text>
          <View style={styles.packContainer}>
            <TouchableOpacity 
              style={[
                styles.packButton, 
                selectedPack === 3 && styles.selectedPackButton
              ]}
              onPress={() => setSelectedPack(3)}
            >
              <Text style={[
                styles.packButtonText,
                selectedPack === 3 && styles.selectedPackButtonText
              ]}>Pack of 3</Text>
              <Text style={[
                styles.packPriceText,
                selectedPack === 3 && styles.selectedPackButtonText
              ]}>₹{basePrice}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.packButton, 
                selectedPack === 5 && styles.selectedPackButton
              ]}
              onPress={() => setSelectedPack(5)}
            >
              <Text style={[
                styles.packButtonText,
                selectedPack === 5 && styles.selectedPackButtonText
              ]}>Pack of 5</Text>
              <Text style={[
                styles.packPriceText,
                selectedPack === 5 && styles.selectedPackButtonText
              ]}>₹{Math.round(basePrice * 1.2)}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Quantity Selector */}
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={decrementQuantity}
            >
              <Feather name="minus" size={20} color="#555" />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={incrementQuantity}
            >
              <Feather name="plus" size={20} color="#555" />
            </TouchableOpacity>
          </View>
          
          {/* Features */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <Feather name="check-circle" size={18} color={primaryColor} style={styles.featureIcon} />
              <Text style={styles.featureText}>Premium cotton blend</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check-circle" size={18} color={primaryColor} style={styles.featureIcon} />
              <Text style={styles.featureText}>Reinforced heel and toe</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check-circle" size={18} color={primaryColor} style={styles.featureIcon} />
              <Text style={styles.featureText}>Moisture-wicking technology</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check-circle" size={18} color={primaryColor} style={styles.featureIcon} />
              <Text style={styles.featureText}>Machine washable</Text>
            </View>
          </View>
          
          {/* Total Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Price:</Text>
            <Text style={styles.priceValue}>₹{totalPrice}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Add to Cart Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Feather name="shopping-bag" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: primaryColor,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70
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
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryTag: {
    backgroundColor: 'rgba(244, 62, 23, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    color: primaryColor,
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  packContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  packButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    width: 120,
    alignItems: 'center',
  },
  selectedPackButton: {
    borderColor: primaryColor,
    backgroundColor: 'rgba(244, 62, 23, 0.05)',
  },
  packButtonText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  packPriceText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectedPackButtonText: {
    color: primaryColor,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  featureContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#555',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceLabel: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 24,
    color: primaryColor,
    fontWeight: 'bold',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Product;