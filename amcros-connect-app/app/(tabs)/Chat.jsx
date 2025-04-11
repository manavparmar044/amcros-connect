import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getChatResponse } from '../services/chatbot';
import { UserDetailContext } from '../../context/UserDetailContext';
import { useRouter } from 'expo-router';

const primaryColor = "#f43e17";

const Chat = () => {
  const [messages, setMessages] = useState([
    // Initial welcome message
    {
      id: 1,
      text: "Hello! I'm your order assistant. How can I help you today?",
      sender: 'admin',
      timestamp: new Date().toISOString(),
      read: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const userMsg = {
      id: messages.length + 1,
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const botReply = await getChatResponse(newMessage.trim(), userDetail?.email);

      const botMsg = {
        id: userMsg.id + 1,
        text: botReply,
        sender: 'admin',
        timestamp: new Date().toISOString(),
        read: true
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // Handle error
      const errorMsg = {
        id: userMsg.id + 1,
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'admin',
        timestamp: new Date().toISOString(),
        read: true
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Order Assistant</Text>
        
        <View style={{ width: 40 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.adminBubble
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.sender === 'user' ? styles.userMessageText : styles.adminMessageText
            ]}>
              {msg.text}
            </Text>
            <Text style={[
              styles.timeText,
              msg.sender === 'user' ? styles.userTimeText : styles.adminTimeText
            ]}>
              {formatTime(new Date(msg.timestamp))}
            </Text>
          </View>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <View style={[styles.messageBubble, styles.adminBubble, styles.loadingBubble]}>
            <View style={styles.loadingDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask about your order..."
          placeholderTextColor="#999"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend} 
          disabled={newMessage.trim() === ''}
        >
          <Feather 
            name="send" 
            size={22} 
            color={newMessage.trim() === '' ? '#ccc' : primaryColor} 
          />
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: primaryColor,
    borderBottomRightRadius: 4,
  },
  adminBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  adminMessageText: {
    color: '#333',
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  adminTimeText: {
    color: '#999',
  },
  loadingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 70,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
    opacity: 0.7,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 45,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    maxHeight: 100,
  },
  sendButton: {
    position: 'absolute',
    right: 20,
    bottom: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;