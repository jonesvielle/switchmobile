import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native'; // or any icon library you use

interface PrimaryTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
}

const PrimaryTextInput: React.FC<PrimaryTextInputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  showPasswordToggle = false,
  secureTextEntry: initialSecure = false,
  leftIcon,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(initialSecure);

  const toggleSecureEntry = () => setSecureTextEntry(prev => !prev);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, isFocused && styles.labelFocused]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, error && styles.inputError, inputStyle]}
          placeholderTextColor="#9CA3AF"
          selectionColor="#6366f1"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={showPasswordToggle ? secureTextEntry : initialSecure}
          autoCapitalize="none"
          {...rest}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={toggleSecureEntry}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.eyeIcon}
          >
            {secureTextEntry ? (
              <EyeOff size={20} color="#6B7280" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default PrimaryTextInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },

  label: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 6,
    fontWeight: '500',
  },
  labelFocused: {
    color: '#6366f1',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: '#6366f1',
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },

  leftIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 20,
    color: '#111827',
    paddingVertical: 0,
  },
  inputError: {
    color: '#111827',
  },

  eyeIcon: {
    padding: 4,
  },

  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },
});
