import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'filled' | 'outlined' | 'text';
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'filled',
}) => {
  const isFilled = variant === 'filled';
  const isOutlined = variant === 'outlined';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFilled && styles.filled,
        isOutlined && styles.outlined,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? '#ffffff' : '#6366f1'} />
      ) : (
        <Text
          style={[
            styles.text,
            isFilled && styles.textFilled,
            isOutlined && styles.textOutlined,
            disabled && styles.textDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 8,
  },

  filled: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6366f1',
  },

  disabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  textFilled: {
    color: '#ffffff',
  },

  textOutlined: {
    color: '#6366f1',
  },

  textDisabled: {
    color: '#9CA3AF',
  },
});
