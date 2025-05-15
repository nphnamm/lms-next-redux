import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { authService } from '../services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5029/api';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = authService.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (!originalRequest) {
          return Promise.reject(error);
        }

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const response = await authService.refreshToken();
            if (response.data.accessToken) {
              // Update the authorization header
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              // Retry the original request
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config = {}) {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T>(url: string, data = {}, config = {}) {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T>(url: string, data = {}, config = {}) {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config = {}) {
    return this.axiosInstance.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient(); 