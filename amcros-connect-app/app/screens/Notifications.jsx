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
    // Dummy notification data
    const dummyNotifications = [
      {
        id: '1',
        title: 'Order Shipped',
        message: 'Your order #AMC123456 has been shipped and is on its way to you. Expected delivery: Tomorrow.',
        time: '2 hours ago',
        isRead: false,
        type: 'order'
      },
      {
        id: '2',
        title: 'New Products Available',
        message: 'Check out our latest collection of premium cotton socks. Limited time offer - 20% off!',
        time: '1 day ago',
        isRead: true,
        type: 'promotion'
      },
      {
        id: '3',
        title: 'Payment Successful',
        message: 'Your payment of ₹1,299 for order #AMC123455 has been processed successfully.',
        time: '2 days ago',
        isRead: true,
        type: 'payment'
      },
      {
        id: '4',
        title: 'Welcome to Our Store!',
        message: 'Thank you for joining us! Explore our premium collection and enjoy your shopping experience.',
        time: '3 days ago',
        isRead: true,
        type: 'welcome'
      },
      {
        id: '5',
        title: 'Order Delivered',
        message: 'Your order #AMC123454 has been delivered successfully. We hope you love your purchase!',
        time: '1 week ago',
        isRead: true,
        type: 'order'
      },
      {
        id: '6',
        title: 'Weekend Sale Alert',
        message: 'Don\'t miss out! Weekend sale is live now. Get up to 30% off on selected items.',
        time: '1 week ago',
        isRead: true,
        type: 'promotion'
      }
    ];
    
    setNotifications(dummyNotifications);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return 'package';
      case 'payment':
        return 'credit-card';
      case 'promotion':
        return 'tag';
      case 'welcome':
        return 'heart';
      default:
        return 'bell';
    }
  };

  const getNotificationIconColor = (type) => {
    switch (type) {
      case 'order':
        return '#2196F3';
      case 'payment':
        return '#4CAF50';
      case 'promotion':
        return primaryColor;
      case 'welcome':
        return '#E91E63';
      default:
        return '#999';
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      {/* Header - Matched with Orders.jsx structure */}
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
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
              Notifications
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Feather name="bell-off" size={50} color="#ccc" />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! We'll notify you when there's something new.
            </Text>
          </View>
        ) : (
          <>
            {/* Unread notifications count */}
            {notifications.filter(n => !n.isRead).length > 0 && (
              <View style={styles.unreadHeader}>
                <Text style={styles.unreadText}>
                  {notifications.filter(n => !n.isRead).length} unread notification{notifications.filter(n => !n.isRead).length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
            
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadCard
                ]}
                onPress={() => markAsRead(notification.id)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <View style={styles.iconContainer}>
                      <View 
                        style={[
                          styles.iconBackground,
                          { backgroundColor: `${getNotificationIconColor(notification.type)}20` }
                        ]}
                      >
                        <Feather 
                          name={getNotificationIcon(notification.type)} 
                          size={18} 
                          color={getNotificationIconColor(notification.type)} 
                        />
                      </View>
                    </View>
                    
                    <View style={styles.notificationInfo}>
                      <View style={styles.titleRow}>
                        <Text style={[
                          styles.notificationTitle,
                          !notification.isRead && styles.unreadTitle
                        ]}>
                          {notification.title}
                        </Text>
                        {!notification.isRead && (
                          <View style={styles.unreadDot} />
                        )}
                      </View>
                      
                      <Text style={styles.notificationMessage} numberOfLines={2}>
                        {notification.message}
                      </Text>
                      
                      <Text style={styles.notificationTime}>
                        {notification.time}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  unreadHeader: {
    backgroundColor: `${primaryColor}15`,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  unreadText: {
    fontSize: 14,
    fontWeight: '600',
    color: primaryColor,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#222',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: primaryColor,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
});

export default Notification;