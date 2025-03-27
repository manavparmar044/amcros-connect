import { View, Text, TouchableOpacity, StatusBar, ScrollView, Alert, StyleSheet, Platform } from "react-native";
import React, { useContext } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const primaryColor = "#f43e17";

const Account = () => {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Logout", 
          onPress: () => {
            signOut(auth)
              .then(() => {
                router.replace("/auth/signIn");
              })
              .catch((error) => {
                console.log("Logout Error:", error);
                Alert.alert("Error", "Failed to logout. Please try again.");
              });
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderInfoItem = (icon, label, value) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIconContainer}>
        <Feather name={icon} size={18} color={primaryColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
          {value || "Not provided"}
        </Text>
      </View>
    </View>
  );

  const renderSettingsItem = (icon, title, subtitle, onPress) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsIconContainer}>
        <Ionicons name={icon} size={22} color="#fff" />
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={22} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.push("/account/edit")}
        >
          <Feather name="edit-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="business" size={40} color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.businessName} numberOfLines={1}>
                {userDetail?.businessName || "Business Name"}
              </Text>
              <Text style={styles.memberSince}>
                Member since {userDetail?.createdAt ? new Date(userDetail.createdAt).getFullYear() : new Date().getFullYear()}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Business Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.sectionContent}>
            {renderInfoItem("hash", "GSTIN", userDetail?.gstin)}
            {renderInfoItem("mail", "Email", userDetail?.email)}
            {renderInfoItem("phone", "Contact", userDetail?.contact)}
            {renderInfoItem("map-pin", "Address", userDetail?.address)}
          </View>
        </View>
        
        {/* Account Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.sectionContent}>
            {renderSettingsItem("notifications-outline", "Notifications", "Manage your notification preferences", () => router.push("/settings/notifications"))}
            {renderSettingsItem("lock-closed-outline", "Security", "Update password and security settings", () => router.push("/settings/security"))}
            {renderSettingsItem("card-outline", "Payment Methods", "Manage your payment options", () => router.push("/settings/payments"))}
            {renderSettingsItem("help-circle-outline", "Help & Support", "Get assistance and view FAQs", () => router.push("/support"))}
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={18} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: primaryColor,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  memberSince: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(244, 62, 23, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  settingsSubtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: primaryColor,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  }
});

export default Account;