import Cookies from 'js-cookie';
import { apiClient } from '../utils/api';

interface AuthResponse {
  data?: {  
    accessToken?: string;
    refreshToken?: string;
    user?: any;
  };
}
interface RegisterResponse {
  data?: {  
    token?: string;
    message?: string;
  };
}


const authService = {
  async register(credentials: { email: string; password: string; name: string }) {
    const response = await apiClient.post<RegisterResponse>('/auth/register', credentials);
    // Store the registration token temporarily
    if (response.data?.data?.token) {
      Cookies.set('reg_token', response.data.data.token,   { expires: 1 }); // Expires in 1 day
    }
    return response;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // Store tokens in cookies
    if (response.data?.data?.accessToken && response.data?.data?.refreshToken) {
      Cookies.set('access_token', response.data.data.accessToken, { expires: 1 }); // Expires in 1 day
      Cookies.set('refresh_token', response.data.data.refreshToken, { expires: 7 }); // Expires in 7 days
    }
    return response;
  },

  async verifyOTP(otp: string) {
    const regToken = Cookies.get('reg_token');
    if (!regToken) throw new Error('Registration token not found');
    
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', { otp }, {
      headers: { Authorization: `Bearer ${regToken}` }
    });
    
    // Clear registration token after successful verification
    Cookies.remove('reg_token');
    return response;
  },

  async refreshToken() {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) throw new Error('Refresh token not found');

    const response = await apiClient.post<AuthResponse>('/auth/refresh-token', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });

    if (response.data?.data?.accessToken) {
      Cookies.set('access_token', response.data.data.accessToken, { expires: 1 });
    }
    return response;
  },

  getAccessToken() {
    return Cookies.get('access_token');
  },

  getRefreshToken() {
    return Cookies.get('refresh_token');
  },

  logout() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    return true;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me', {
      withCredentials: true
    });
    return response;
  }
};

export { authService }; 