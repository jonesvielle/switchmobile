import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/authSlice';
import { persistor } from '../store';

export const DrawerContent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const drawerItems = [
    { label: 'Profile', onPress: () => {} },
    { label: 'Settings', onPress: () => {} },
    { label: 'Security', onPress: () => {} },
    { label: 'Help', onPress: () => {} },
    {
      label: 'Logout',
      onPress: () => {
        dispatch(clearUser());
        persistor.purge();

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          }),
        );
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Switch Pay</Text>

      {drawerItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.itemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 40,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemText: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '500',
  },
});
