import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Alert,
    ScrollView,
    Image,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { Feather } from "@expo/vector-icons";
  import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
  import { db } from "../../config/firebaseConfig";
  import { useRouter } from "expo-router";
  
  const ProductEdit = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const primaryColor = "#f43e17";
    const router = useRouter();
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const snapshot = await getDocs(collection(db, "products"));
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(data);
        } catch (err) {
          console.error("Failed to fetch products:", err);
        }
      };
  
      fetchProducts();
    }, []);
  
    const handleUpdateProduct = async () => {
      if (!selectedProduct) return;
  
      try {
        const productRef = doc(db, "products", selectedProduct.id);
        await updateDoc(productRef, {
          name: selectedProduct.name,
          image: selectedProduct.image,
          variants: selectedProduct.variants,
        });
        Alert.alert("Success", "Product updated successfully.");
        setSelectedProduct(null);
      } catch (err) {
        console.error("Failed to update product:", err);
        Alert.alert("Error", "Could not update product.");
      }
    };
  
    const renderProductItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => setSelectedProduct(item)}
        style={{
          padding: 12,
          borderBottomWidth: 1,
          borderColor: "#eee",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 8,
            backgroundColor: "#f0f0f0",
            marginRight: 12,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.name}</Text>
          <Text style={{ color: "#777", marginTop: 3 }}>
            ₹{item.variants?.[0]?.price || "—"}
          </Text>
        </View>
        <Feather name="edit-3" size={20} color={primaryColor} />
      </TouchableOpacity>
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
                Product Editor
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
  
        {selectedProduct ? (
          <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Edit Product
            </Text>
  
            <TextInput
              placeholder="Product Name"
              value={selectedProduct.name}
              onChangeText={(text) =>
                setSelectedProduct({ ...selectedProduct, name: text })
              }
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
              }}
            />
  
            <TextInput
              placeholder="Image URL"
              value={selectedProduct.image}
              onChangeText={(text) =>
                setSelectedProduct({ ...selectedProduct, image: text })
              }
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
              }}
            />
  
            <TextInput
              placeholder="Price (first variant)"
              keyboardType="numeric"
              value={selectedProduct.variants?.[0]?.price?.toString() || ""}
              onChangeText={(text) => {
                const updatedVariants = [...(selectedProduct.variants || [])];
                if (updatedVariants.length === 0) updatedVariants.push({});
                updatedVariants[0].price = parseFloat(text);
                setSelectedProduct({ ...selectedProduct, variants: updatedVariants });
              }}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />
  
            <TouchableOpacity
              onPress={handleUpdateProduct}
              style={{
                backgroundColor: primaryColor,
                padding: 15,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => setSelectedProduct(null)}
              style={{
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ccc",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#333" }}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    );
  };
  
  export default ProductEdit;
  