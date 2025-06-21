import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { ILoginCredentials, ILoginResponse } from '../types/auth.types';
import { useAppDispatch } from '@/store/hooks';
import { clearAuthData, setAuthData } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const signInWithPassword = useMutation({
    mutationFn: (data: ILoginCredentials) => authApi.signInWithPassword(data),
    onSuccess: (tokens: Partial<ILoginResponse>) => {
      localStorage.setItem('accessToken', tokens.accessToken || '');
      localStorage.setItem('idToken', tokens.idToken || '');
      localStorage.setItem('refreshToken', tokens.refreshToken || '');
      localStorage.setItem('user', JSON.stringify(tokens.user || {}));
      localStorage.setItem('isAuthenticated', 'true');
      dispatch(setAuthData(tokens));
    },
  });

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    dispatch(clearAuthData());
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };

  return {
    signInWithPassword,
    signOut,
    isAuthenticated,
  };
}; 