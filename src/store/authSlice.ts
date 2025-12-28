import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types/authTypes';

const initialState: AuthState = {
  firstName: null,
  lastName: null,
  accountNumber: null,
  avatar: null,
  createdAt: null,
  id: null,
  fullName: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccountDetails(state, action: PayloadAction<Partial<AuthState>>) {
      const user = action.payload;

      state.firstName = user.firstName ?? null;
      state.lastName = user.lastName ?? null;
      state.accountNumber = user.accountNumber ?? null;
      state.avatar = user.avatar ?? null;
      state.createdAt = user.createdAt ?? null;
      state.id = user.id ?? null;

      if (user.firstName || user.lastName) {
        state.fullName = `${user.firstName || ''} ${
          user.lastName || ''
        }`.trim();
      } else {
        state.fullName = null;
      }
    },

    clearUser(state) {
      state.createdAt = null;
      state.id = null;
      state.fullName = null;
      state.firstName = null;
      state.lastName = null;
      state.accountNumber = null;
      state.avatar = null;
    },
  },
});

export const { setAccountDetails, clearUser } = authSlice.actions;
export default authSlice.reducer;
