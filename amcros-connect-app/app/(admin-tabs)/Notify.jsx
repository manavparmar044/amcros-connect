import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const primaryColor = "#f43e17";

const Notify = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState('all'); // 'all', 'specific'
  const [sendToAll, setSendToAll] = useState(true);
  const [includeImage, setIncludeImage] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([
    {
      id: '1',
      title: 'New Products Available',
      message: 'Check out our latest collection of premium socks!',
      sentTo: 'All Users',
      sentAt: '2 hours ago',
      status: 'Delivered'
    },
    {
      id: '2',
      title: 'Weekend Sale',
      message: 'Enjoy 20% off on all products this weekend. Use code WEEKEND20.',
      sentTo: 'Active Users',
      sentAt: '1 day ago',
      status: 'Delivered'
    },
    {
      id: '3',
      title: 'Order Update',
      message: 'Your recent orders have been shipped. Track them in the Orders section.',
      sentTo: 'Recent Customers',
      sentAt: '3 days ago',
      status: 'Delivered'
    }
  ]);

  const handleSendNotification = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a notification title');
      return;
    }
    
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a notification message');
      return;
    }
    
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      const newNotification = {
        id: Date.now().toString(),
        title,
        message,
        sentTo: sendToAll ? 'All Users' : 'Selected Users',
        sentAt: 'Just now',
        status: 'Sent'
      };
      
      setRecentNotifications([newNotification, ...recentNotifications]);
      setTitle('');
      setMessage('');
      setIsSending(false);
      
      Alert.alert(
        'Success',
        'Notification has been sent successfully!',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const renderNotificationTypeButton = (type, label) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        notificationType === type && styles.selectedTypeButton
      ]}
      onPress={() => {
        setNotificationType(type);
        setSendToAll(type === 'all');
      }}
    >
      <Text
        style={[
          styles.typeButtonText,
          notificationType === type && styles.selectedTypeButtonText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
              Push Notifications
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification Composer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Notification</Text>
          
          <Text style={styles.inputLabel}>Notification Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter notification title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          <Text style={styles.charCount}>{title.length}/50</Text>
          
          <Text style={styles.inputLabel}>Notification Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter notification message"
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
          <Text style={styles.charCount}>{message.length}/200</Text>
          
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Include Image</Text>
            <Switch
              trackColor={{ false: "#ddd", true: `${primaryColor}80` }}
              thumbColor={includeImage ? primaryColor : "#f4f4f4"}
              onValueChange={setIncludeImage}
              value={includeImage}
            />
          </View>
          
          {includeImage && (
            <TouchableOpacity style={styles.imageSelector}>
              <Feather name="image" size={24} color="#999" />
              <Text style={styles.imageSelectorText}>Select an image</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Target Audience */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Target Audience</Text>
          
          <View style={styles.typeButtonsContainer}>
            {renderNotificationTypeButton('all', 'All Users')}
            {renderNotificationTypeButton('specific', 'Specific Users')}
          </View>
          
          {notificationType === 'specific' && (
            <View style={styles.specificOptions}>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Active Users</Text>
                <Switch
                  trackColor={{ false: "#ddd", true: `${primaryColor}80` }}
                  thumbColor={true ? primaryColor : "#f4f4f4"}
                  value={true}
                />
              </View>
              
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Recent Customers</Text>
                <Switch
                  trackColor={{ false: "#ddd", true: `${primaryColor}80` }}
                  thumbColor={true ? primaryColor : "#f4f4f4"}
                  value={true}
                />
              </View>
              
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>New Users</Text>
                <Switch
                  trackColor={{ false: "#ddd", true: `${primaryColor}80` }}
                  thumbColor={false ? primaryColor : "#f4f4f4"}
                  value={false}
                />
              </View>
            </View>
          )}
        </View>
        
        {/* Notification Preview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preview</Text>
          
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <View style={styles.previewIcon}>
                <Feather name="bell" size={16} color="#fff" />
              </View>
              <Text style={styles.previewAppName}>Your App</Text>
              <Text style={styles.previewTime}>now</Text>
            </View>
            
            <Text style={styles.previewTitle}>
              {title || "Notification Title"}
            </Text>
            <Text style={styles.previewMessage}>
              {message || "Notification message will appear here. Write something to see the preview."}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (isSending || !title || !message) && styles.disabledButton
            ]}
            onPress={handleSendNotification}
            disabled={isSending || !title || !message}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="send" size={18} color="#fff" style={styles.sendIcon} />
                <Text style={styles.sendButtonText}>Send Notification</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Recent Notifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Notifications</Text>
          
          {recentNotifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationTime}>{notification.sentAt}</Text>
              </View>
              
              <Text style={styles.notificationMessage} numberOfLines={2}>
                {notification.message}
              </Text>
              
              <View style={styles.notificationFooter}>
                <Text style={styles.notificationTarget}>
                  Sent to: {notification.sentTo}
                </Text>
                <View style={styles.statusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{notification.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 15,
    color: '#555',
  },
  imageSelector: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageSelectorText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  selectedTypeButton: {
    backgroundColor: `${primaryColor}15`,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedTypeButtonText: {
    color: primaryColor,
    fontWeight: '600',
  },
  specificOptions: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  previewContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  previewAppName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  previewTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 'auto',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  previewMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
    marginBottom: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTarget: {
    fontSize: 12,
    color: '#888',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default Notify;