import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Dimensions,
  BackHandler,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';

import { login } from '../services/api';
import { setAccountDetails } from '../store/authSlice';
import { RootState } from '../store';
import PrimaryTextInput from '../component/PrimaryTextInput';
import PrimaryButton from '../component/PrimaryButton';
import { User, Lock, Hand } from 'lucide-react-native';
import Illustration from '../assets/svg/logi.svg';

import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');
const BIOMETRIC_KEY = '@hasBiometricEnabled';

export default function LoginScreen() {
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const persistedFirstName = useSelector(
    (state: RootState) => state?.auth?.firstName,
  );

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      navigation.setOptions({ gestureEnabled: false });

      return () => {
        backHandler.remove();
        navigation.setOptions({ gestureEnabled: true });
      };
    }, [navigation]),
  );

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const rnBiometrics = new ReactNativeBiometrics();
        const { available } = await rnBiometrics.isSensorAvailable();
        setBiometricAvailable(available);
      } catch (error) {
        console.log('Biometrics check failed:', error);
      }
    };

    checkBiometrics();
  }, []);

  const handleBiometricAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const rnBiometrics = new ReactNativeBiometrics();
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Login with biometrics',
        fallbackPromptMessage: 'Use PIN',
      });

      if (success) {
        navigation.navigate('Main');
        // const user = await login(accountNumber.trim(), pin.trim());
        // if (user) {
        //   dispatch(setAccountDetails(user));
        //   navigation.navigate('Main');
        // } else {
        //   setLoginError('Invalid account number or PIN');
        // }
      }
    } catch (error: any) {
      console.error('Biometric error:', error);
      setLoginError('Biometric authentication failed or network issue');
    } finally {
      setIsLoading(false);
    }
  }, [navigation, accountNumber, pin, dispatch]);

  const handleManualLogin = async () => {
    if (!accountNumber.trim()) {
      setLoginError('Account number is required');
      return;
    }
    if (!pin.trim()) {
      setLoginError('PIN is required');
      return;
    }

    setLoginError(undefined);
    setIsLoading(true);

    try {
      const user = await login(accountNumber.trim(), pin.trim());

      if (user) {
        dispatch(setAccountDetails(user));

        if (biometricAvailable) {
          const alreadyEnabled = await AsyncStorage.getItem(BIOMETRIC_KEY);
          if (alreadyEnabled !== 'true') {
            Alert.alert(
              'Enable Biometrics?',
              'Use Face ID / Fingerprint for faster login next time?',
              [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes',
                  onPress: async () => {
                    await AsyncStorage.setItem(BIOMETRIC_KEY, 'true');
                  },
                },
              ],
            );
          }
        }

        navigation.navigate('Main');
      } else {
        setLoginError('Invalid account number or PIN');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.message || 'Something went wrong';
      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <Illustration width={width * 0.65} height={width * 0.65} />
      </View>

      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          {persistedFirstName ? 'Hey' : 'Hello'}
        </Text>
        <Text style={styles.nameHighlight}>
          {persistedFirstName
            ? ` ${persistedFirstName.split(' ')[0]}!`
            : ' there'}
        </Text>
        <Text style={styles.handIcon}>
          <Hand />
        </Text>
      </View>

      {persistedFirstName && biometricAvailable && (
        <PrimaryButton
          title="Login with Biometrics"
          onPress={handleBiometricAuth}
          variant="outlined"
          style={styles.biometricButton}
        />
      )}

      {loginError && <Text style={styles.errorText}>{loginError}</Text>}

      <PrimaryTextInput
        label="Username (Account ID)"
        placeholder="e.g. 90081059"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={10}
        leftIcon={<User size={20} color="#6B7280" />}
      />

      <PrimaryTextInput
        label="Password/PIN"
        placeholder="Enter your 4-digit PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        secureTextEntry
        showPasswordToggle
        maxLength={6}
        leftIcon={<Lock size={20} color="#6B7280" />}
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="LOGIN"
          onPress={handleManualLogin}
          loading={isLoading}
          variant="filled"
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 40,
  },
  greetingText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1F2937',
  },
  nameHighlight: {
    fontSize: 34,
    fontWeight: '900',
    color: '#00A859',
    marginLeft: 8,
  },
  handIcon: {
    fontSize: 36,
    marginLeft: 8,
  },
  biometricButton: {
    marginBottom: 24,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 50,
  },
  button: {
    marginTop: 32,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
