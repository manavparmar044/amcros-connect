import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const primaryColor = "#f43e17";

// Dummy chat data
const initialMessages = [
  {
    id: 1,
    text: "Hello! How can I help you today?",
    sender: "admin",
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    read: true
  },
  {
    id: 2,
    text: "I have a question about my recent order #12345",
    sender: "user",
    timestamp: new Date(Date.now() - 3600000 * 1.9), // 1.9 hours ago
    read: true
  },
  {
    id: 3,
    text: "Of course, I'd be happy to help with that. Could you please tell me what specific information you need about your order?",
    sender: "admin",
    timestamp: new Date(Date.now() - 3600000 * 1.8), // 1.8 hours ago
    read: true
  },
  {
    id: 4,
    text: "I wanted to know when it will be shipped. It's been 3 days since I placed the order.",
    sender: "user",
    timestamp: new Date(Date.now() - 3600000 * 1.7), // 1.7 hours ago
    read: true
  },
  {
    id: 5,
    text: "Let me check that for you right away. One moment please...",
    sender: "admin",
    timestamp: new Date(Date.now() - 3600000 * 1.6), // 1.6 hours ago
    read: true
  },
  {
    id: 6,
    text: "I've checked your order and I can see it's been processed. It's scheduled to ship tomorrow and you should receive a tracking number via email once it's on its way.",
    sender: "admin",
    timestamp: new Date(Date.now() - 3600000 * 1.5), // 1.5 hours ago
    read: true
  },
  {
    id: 7,
    text: "That's great, thank you for checking!",
    sender: "user",
    timestamp: new Date(Date.now() - 3600000 * 1.4), // 1.4 hours ago
    read: true
  },
  {
    id: 8,
    text: "You're welcome! Is there anything else I can help you with today?",
    sender: "admin",
    timestamp: new Date(Date.now() - 3600000 * 0.5), // 30 minutes ago
    read: true
  }
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const handleSend = () => {
    if (newMessage.trim() === '') return;
    
    const userMessage = {
      id: messages.length + 1,
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      read: false
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate admin response after a short delay
    setTimeout(() => {
      const adminResponse = {
        id: messages.length + 2,
        text: "Thanks for your message. Our admin will get back to you shortly.",
        sender: 'admin',
        timestamp: new Date(),
        read: false
      };
      
      setMessages(prevMessages => [...prevMessages, adminResponse]);
    }, 1000);
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.adminInfo}>
          <View style={styles.adminAvatar}>
            <Text style={styles.adminInitial}>A</Text>
          </View>
          <View>
            <Text style={styles.adminName}>Admin Support</Text>
            <Text style={styles.adminStatus}>Online</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <View key={date}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{date}</Text>
            </View>
            
            {dateMessages.map((message) => (
              <View 
                key={message.id} 
                style={[
                  styles.messageWrapper,
                  message.sender === 'user' ? styles.userMessageWrapper : styles.adminMessageWrapper
                ]}
              >
                {message.sender === 'admin' && (
                  <View style={styles.messageBubbleAvatar}>
                    <Text style={styles.messageBubbleAvatarText}>A</Text>
                  </View>
                )}
                
                <View 
                  style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userMessage : styles.adminMessage
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userMessageText : styles.adminMessageText
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    message.sender === 'user' ? styles.userMessageTime : styles.adminMessageTime
                  ]}>
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
                
                {message.sender === 'user' && (
                  <View style={styles.messageStatus}>
                    {message.read ? (
                      <Feather name="check-circle" size={14} color="#4CAF50" />
                    ) : (
                      <Feather name="check" size={14} color="#999" />
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      
      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Feather name="paperclip" size={22} color="#777" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            newMessage.trim() === '' ? styles.sendButtonDisabled : {}
          ]}
          onPress={handleSend}
          disabled={newMessage.trim() === ''}
        >
          <Feather name="send" size={20} color={newMessage.trim() === '' ? "#ccc" : "#fff"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  adminInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
  },
  adminName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  adminStatus: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 20,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  adminMessageWrapper: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  messageBubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  messageBubbleAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 2,
  },
  userMessage: {
    backgroundColor: primaryColor,
    borderBottomRightRadius: 4,
  },
  adminMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginRight: 40,
  },
  userMessageText: {
    color: '#fff',
  },
  adminMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  adminMessageTime: {
    color: '#999',
  },
  messageStatus: {
    alignSelf: 'flex-end',
    marginLeft: 4,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
});

export default Chat;