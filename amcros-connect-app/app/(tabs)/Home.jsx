import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Feather } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { UserDetailContext } from "../../context/UserDetailContext";

const Home = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);

  const primaryColor = "#f43e17";
  const categories = ["All", "Designer", "Ankle", "Women", "Sports"];

  const router = useRouter()

  const { userDetail,setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    if(userDetail){
      console.log("User detail: ",userDetail);
    }
    else{
      console.log("Empty");
    }
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

  // Updated filter for multiple types in array
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      activeCategory === "All"
        ? true
        : Array.isArray(item.type) && item.type.includes(activeCategory);
  
    const matchesSearch =
      search.trim() === "" ||
      item.name.toLowerCase().includes(search.toLowerCase());
  
    return matchesCategory && matchesSearch;
  });

  const isAdmin = userDetail?.email === "admin@gmail.com";

  if (isAdmin) {
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


  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      {/* Top Bar */}
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
              Hello, {userDetail?.businessName}
            </Text>
            <TouchableOpacity onPress={() => router.push("/Cart")}>
              <Feather name="shopping-cart" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Search Bar */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Feather
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 10 }}
          />
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
                backgroundColor:
                  activeCategory === item ? primaryColor : "#fff",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: activeCategory === item ? primaryColor : "#ddd",
              }}
            >
              <Text
                style={{
                  color: activeCategory === item ? "#fff" : "#333",
                  fontWeight: activeCategory === item ? "600" : "normal",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Section Title */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 15,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
          Our Collection
        </Text>
        <Text style={{ color: "#777", fontSize: 14 }}>
          {filteredProducts.length} products
        </Text>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "../screens/Product",
      params: {
        name: item.name,
        image: item.image,
        price: item.variants?.[0]?.price || "—",
      },
    })
  }
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
    overflow: "hidden",
  }}
>
            <View
              style={{
                height: 140,
                backgroundColor: "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
            </View>

            <View style={{ padding: 12 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: 4,
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: primaryColor,
                }}
              >
                From ₹{item.variants?.[0]?.price || "—"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Home;
