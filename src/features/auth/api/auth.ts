import axios from "axios";
import { ILoginCredentials, ILoginResponse } from '../types/auth.types';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_IAM_SERVICE_URL;

export const authApi = {
  signInWithPassword: async (data: ILoginCredentials): Promise<ILoginResponse> => {
    const response = await axios.post(`${AUTH_BASE_URL}/auth/signin/password`, data);
    console.log(response.data.data);
    return response.data.data;
  },
}; 