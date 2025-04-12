import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";

const primaryColor = "#f43e17";

const EditDetails = () => {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const [businessName, setBusinessName] = useState(userDetail?.businessName || "");
  const [gstin, setGstin] = useState(userDetail?.gstin || "");
  const [contact, setContact] = useState(userDetail?.contact || "");
  const [address, setAddress] = useState(userDetail?.address || "");

  const handleUpdate = async () => {
    try {
      const updatedData = {
        businessName,
        gstin,
        contact,
        address,
      };

      const userRef = doc(db, "users", userDetail.email);
      await updateDoc(userRef, updatedData);
      setUserDetail({ ...userDetail, ...updatedData });

      Alert.alert("Success", "Details updated successfully.");
      router.back();
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Failed to update details.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      <SafeAreaView
        style={{
          backgroundColor: primaryColor,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View
          style={{
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            Edit Details
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>Business Name</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Enter business name"
        />

        <Text style={{ fontSize: 14, color: "#555", marginBottom: 4, marginTop: 16 }}>GSTIN</Text>
        <TextInput
          style={styles.input}
          value={gstin}
          onChangeText={setGstin}
          placeholder="Enter GSTIN"
        />

        <Text style={{ fontSize: 14, color: "#555", marginBottom: 4, marginTop: 16 }}>Contact</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="Enter contact number"
          keyboardType="phone-pad"
        />

        <Text style={{ fontSize: 14, color: "#555", marginBottom: 4, marginTop: 16 }}>Address</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditDetails;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: primaryColor,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});