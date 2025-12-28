import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT ? parseInt(API_TIMEOUT, 10) : 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      return Promise.reject(
        new Error('No internet connection. Please check your network.'),
      );
    }
    return Promise.reject(error);
  },
);

export const login = async (accountNumber: string, pin: string) => {
  try {
    const response = await api.get('/login');
    const users = response.data;

    console.log('All users fetched:', users);

    if (!Array.isArray(users) || users.length === 0) {
      throw new Error('No users found');
    }

    const matchedUser = users.find(
      (user: any) =>
        user.accountNumber === accountNumber.trim() &&
        user.password === pin.trim(),
    );

    if (!matchedUser) {
      throw new Error('Invalid account number or PIN');
    }

    return {
      ...matchedUser,
      name: `${matchedUser.firstName || ''} ${
        matchedUser.lastName || ''
      }`.trim(),
    };
  } catch (error: any) {
    throw error;
  }
};

export const getBankAccounts = async () => {
  try {
    const response = await api.get('/account');
    console.log('Fetched accounts:', response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      'Failed to load bank accounts. Please check your connection.',
    );
  }
};
