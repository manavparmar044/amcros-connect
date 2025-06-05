import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const primaryColor = '#f43e17';

const Payment = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      
      {/* Header */}
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
    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
      Payment Info
    </Text>
    {/* Spacer */}
    <View style={{ width: 24 }} />
  </View>
</SafeAreaView>


      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <Feather name="credit-card" size={48} color="#ccc" />
        <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 20 }}>
          Cash on Delivery Only
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, color: '#666' }}>
          We are currently working on integrating secure online payment options. For now, please proceed with Cash on Delivery.
        </Text>
      </View>
    </View>
  );
};

export default Payment;
