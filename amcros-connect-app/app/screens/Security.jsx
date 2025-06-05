import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const primaryColor = '#f43e17';

const Security = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      {/* Header */}
      <SafeAreaView style={{ backgroundColor: primaryColor }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      {/* Content */}
      <View style={styles.container}>
        <Text style={styles.title}>Contact here for change in password or account reset</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>amcros-hitex@gmail.com</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.info}>+91 86987 40487</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#555',
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
});

export default Security;
