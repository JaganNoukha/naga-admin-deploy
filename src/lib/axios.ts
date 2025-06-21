import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_CONFIG = {
  BASE_URLS: {
    MDM: 'https://l6nqns5r-3000.inc1.devtunnels.ms/api/naga-mdm-service',
  },
  TIMEOUT: 30000,
};

class ApiService {
  private static instance: ApiService;
  private axiosInstances: Map<string, AxiosInstance> = new Map();

  private constructor() {
    Object.entries(API_CONFIG.BASE_URLS).forEach(([service, baseURL]) => {
      const instance = axios.create({
        baseURL,
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      instance.interceptors.response.use(
        (response: AxiosResponse) => {
          return response.data;
        },
        (error: AxiosError) => {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                break;
              case 403:
                break;
              case 404:
                break;
              case 500:
                break;
            }
          }
          return Promise.reject(error);
        }
      );

      this.axiosInstances.set(service, instance);
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public getService(serviceName: keyof typeof API_CONFIG.BASE_URLS): AxiosInstance {
    const instance = this.axiosInstances.get(serviceName);
    if (!instance) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return instance;
  }
}

export const apiService = ApiService.getInstance();