import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const primaryColor = "#f43e17";

const Notification = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([]);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      <SafeAreaView style={{ backgroundColor: primaryColor }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={50} color="#ccc" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up. We’ll notify you when there’s something new!
            </Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <View key={index} style={styles.notificationCard}>
              <Text style={styles.notificationTitle}>{String(notification.title)}</Text>
              <Text style={styles.notificationMessage}>{String(notification.message)}</Text>
              <Text style={styles.notificationTime}>{String(notification.time)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: primaryColor,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  scrollContent: { flexGrow: 1, padding: 20 },
  emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#555", marginTop: 10 },
  emptySubtitle: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  notificationTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  notificationMessage: { color: "#555", fontSize: 14 },
  notificationTime: { marginTop: 6, fontSize: 12, color: "#999" },
});
