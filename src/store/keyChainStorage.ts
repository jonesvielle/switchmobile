import * as Keychain from 'react-native-keychain';
import { SERVICE_NAME } from '@env';

export const keychainStorage = {
  setItem: async (key: string, value: string) => {
    await Keychain.setGenericPassword(key, value, {
      service: SERVICE_NAME,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  },

  getItem: async (key: string) => {
    const result = await Keychain.getGenericPassword({
      service: SERVICE_NAME,
    });

    if (result && result.username === key) {
      return result.password;
    }
    return null;
  },

  removeItem: async () => {
    await Keychain.resetGenericPassword({
      service: SERVICE_NAME,
    });
    return true;
  },
};
