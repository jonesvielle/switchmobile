import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.appName}>Swicth Pay</Text>
      <Text style={styles.tagline}>Fast. Secure. Seamless.</Text>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 24,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#6366f1',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 18,
    color: '#6366f1',
    opacity: 0.9,
    marginTop: 8,
    marginBottom: 60,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
  },
});

export default SplashScreen;
