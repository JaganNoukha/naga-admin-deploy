import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoginResponse } from '@/features/auth/types/auth.types';

interface IAuthState extends ILoginResponse {
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  idToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setAuthData(state, action: PayloadAction<Partial<ILoginResponse>>) {
      state.isAuthenticated = !!action.payload.accessToken;
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.idToken = action.payload.idToken || null;
      state.refreshToken = action.payload.refreshToken || null;
    },
    clearAuthData(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.idToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setIsAuthenticated, setAuthData, clearAuthData } =
  authSlice.actions;
export default authSlice.reducer;
