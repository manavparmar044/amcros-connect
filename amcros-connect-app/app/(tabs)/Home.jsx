import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StatusBar, 
  Platform,
  SafeAreaView 
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

const Home = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const primaryColor = "#f43e17"; // Your primary color
  
  const categories = ["All", "Men", "Women", "Kids", "Sports"];
  
  // Sample product data
  const products = Array(8).fill(null).map((_, index) => ({
    id: index.toString(),
    name: `Product ${index + 1}`,
    price: `$${(Math.random() * 20 + 10).toFixed(2)}`,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      
      {/* Top Bar with SafeAreaView to handle status bar properly */}
      <View style={{ 
        backgroundColor: primaryColor,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
        <SafeAreaView style={{ backgroundColor: primaryColor }}>
          <View style={{ 
            paddingVertical: 20, 
            paddingHorizontal: 20,
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
              Hello, BusinessName
            </Text>
            <TouchableOpacity>
              <Feather name="shopping-cart" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      
      {/* Search Bar - Now below the top bar */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff' }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#eee",
        }}>
          <Feather name="search" size={20} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search for socks..."
            placeholderTextColor="#999"
            style={{ flex: 1, fontSize: 16, color: "#333" }}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      
      {/* Categories */}
      <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setActiveCategory(item)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                marginHorizontal: 5,
                backgroundColor: activeCategory === item ? primaryColor : '#fff',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: activeCategory === item ? primaryColor : '#ddd',
              }}
            >
              <Text style={{ 
                color: activeCategory === item ? '#fff' : '#333',
                fontWeight: activeCategory === item ? '600' : 'normal',
              }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {/* Section Title with count */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingHorizontal: 20, 
        paddingTop: 15,
        paddingBottom: 10 
      }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#333' }}>
          Our Collection
        </Text>
        <Text style={{ color: '#777', fontSize: 14 }}>
          {products.length} products
        </Text>
      </View>
      
      {/* Product Grid */}
      <FlatList
        data={products}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1,
              margin: 8,
              borderRadius: 12,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
              overflow: 'hidden',
            }}
          >
            <View style={{ height: 140, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="image" size={40} color="#ddd" />
            </View>
            
            <View style={{ padding: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#333', marginBottom: 4 }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: primaryColor }}>
                {item.price}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Home;