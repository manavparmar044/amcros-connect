import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  TextInput,
  Animated,
  LayoutAnimation,
  UIManager,
  FlatList
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const primaryColor = "#f43e17";

// FAQ data organized by categories
const faqData = [
  {
    category: "Orders",
    items: [
      {
        question: "How do I track my order?",
        answer: "You can track your order by going to the 'My Orders' section in your account. Click on the specific order to view its current status and tracking information."
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "Orders can be modified or canceled within 1 hour of placing them. After that, please contact our customer support team for assistance."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards, UPI, net banking, and cash on delivery. All online payments are processed through secure payment gateways."
      }
    ]
  },
  {
    category: "Products",
    items: [
      {
        question: "What materials are used in your products?",
        answer: "Our products are made with premium cotton blend materials that ensure comfort and durability. We use high-quality fabrics that are both soft and long-lasting."
      },
      {
        question: "Are your products machine washable?",
        answer: "Yes, all our products are machine washable. We recommend washing in cold water and air drying for best results and longevity."
      },
      {
        question: "Do you offer different sizes?",
        answer: "Yes, our products come in various sizes. Please refer to our size chart on each product page to find your perfect fit."
      }
    ]
  },
  {
    category: "Shipping & Returns",
    items: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 3-7 business days. Express shipping options are available at checkout for faster delivery within 1-3 business days."
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently, we only ship within India. We're working on expanding our shipping options to international locations in the near future."
      },
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy. If you're not satisfied with your purchase, you can return it within 30 days for a full refund or exchange. The product must be unused and in its original packaging."
      }
    ]
  },
  {
    category: "Account & Support",
    items: [
      {
        question: "How do I reset my password?",
        answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. We'll send you an email with instructions to create a new password."
      },
      {
        question: "How can I contact customer support?",
        answer: "You can reach our customer support team through the 'Contact Us' section in the app, by email at support@example.com, or by phone at +91 1234567890 during business hours."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we take data security very seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent."
      }
    ]
  }
];

const Faq = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('Orders');
  const [expandedItems, setExpandedItems] = useState({});
  
  // Animation value for search bar
  const [searchBarAnim] = useState(new Animated.Value(0));
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Toggle search bar visibility
  const toggleSearch = () => {
    const toValue = isSearchVisible ? 0 : 1;
    
    Animated.timing(searchBarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  // Toggle FAQ category expansion
  const toggleCategory = (category) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Toggle FAQ item expansion
  const toggleItem = (itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === '' 
    ? faqData 
    : faqData.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={toggleSearch}
        >
          <Feather name={isSearchVisible ? "x" : "search"} size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <Animated.View 
        style={[
          styles.searchContainer,
          { 
            maxHeight: searchBarAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 60]
            }),
            opacity: searchBarAnim,
            marginTop: searchBarAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-10, 0]
            })
          }
        ]}
      >
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={isSearchVisible}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      {/* FAQ Content */}
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Tabs */}
        {!searchQuery && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabsContainer}
            contentContainerStyle={styles.categoryTabsContent}
          >
            {faqData.map((category) => (
              <TouchableOpacity
                key={category.category}
                style={[
                  styles.categoryTab,
                  expandedCategory === category.category && styles.activeTab
                ]}
                onPress={() => toggleCategory(category.category)}
              >
                <Text 
                  style={[
                    styles.categoryTabText,
                    expandedCategory === category.category && styles.activeTabText
                  ]}
                >
                  {category.category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        {/* FAQ Items */}
        <View style={styles.faqListContainer}>
          {filteredFaqs.map((category) => (
            <View key={category.category} style={styles.categorySection}>
              {(searchQuery || expandedCategory === category.category) && (
                <>
                  {searchQuery && (
                    <Text style={styles.categoryTitle}>{category.category}</Text>
                  )}
                  
                  {category.items.map((item, index) => {
                    const itemId = `${category.category}-${index}`;
                    const isExpanded = expandedItems[itemId];
                    
                    return (
                      <TouchableOpacity
                        key={itemId}
                        style={[
                          styles.faqItem,
                          isExpanded && styles.expandedItem
                        ]}
                        onPress={() => toggleItem(itemId)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.questionContainer}>
                          <Text style={styles.questionText}>{item.question}</Text>
                          <Feather 
                            name={isExpanded ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color={isExpanded ? primaryColor : "#666"} 
                          />
                        </View>
                        
                        {isExpanded && (
                          <View style={styles.answerContainer}>
                            <Text style={styles.answerText}>{item.answer}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </View>
          ))}
          
          {/* No results message */}
          {searchQuery && filteredFaqs.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Feather name="search" size={50} color="#ddd" />
              <Text style={styles.noResultsText}>No matching FAQs found</Text>
              <Text style={styles.noResultsSubtext}>
                Try using different keywords or browse our categories
              </Text>
            </View>
          )}
          
          {/* Contact support section */}
          <View style={styles.supportContainer}>
            <Text style={styles.supportTitle}>Still have questions?</Text>
            <Text style={styles.supportText}>
              Our customer support team is here to help you with any other questions you might have.
            </Text>
            <TouchableOpacity onPress={() => router.push("../(tabs)/Chat")} style={styles.contactButton}>
              <Feather name="message-circle" size={18} color="#fff" style={styles.contactButtonIcon} />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    backgroundColor: primaryColor,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 8,
  },
  contentContainer: {
    flex: 1,
  },
  categoryTabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryTabsContent: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: `${primaryColor}20`,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  activeTabText: {
    color: primaryColor,
    fontWeight: '600',
  },
  faqListContainer: {
    padding: 15,
  },
  categorySection: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  expandedItem: {
    borderLeftWidth: 3,
    borderLeftColor: primaryColor,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  answerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  supportContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: primaryColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  contactButtonIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Faq;