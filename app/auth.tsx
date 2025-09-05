import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AuthForm } from '@/components/AuthForm';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }}
            style={styles.logo}
          />
        </View>
      </View>
      <AuthForm isLogin={isLogin} onToggleMode={() => setIsLogin(!isLogin)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});