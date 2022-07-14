import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthService } from './AuthService';

export abstract class HttpService {
  protected readonly axiosInstance: AxiosInstance;
  protected readonly authService: AuthService;
  protected readonly baseURL: string;

  public constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
    });
    this.authService = AuthService.getInstance();

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  private initializeRequestInterceptor = () => {
    this.axiosInstance.interceptors.request.use(this.handleRequest);
  };

  private initializeResponseInterceptor = () => {
    this.axiosInstance.interceptors.response.use((response) => {
      return response;
    }, this.handleError);
  };

  private handleRequest = (config: AxiosRequestConfig) => {
    const accessToken = this.authService.getAccessToken();
    if (config.headers && !config.headers['Authorization'] && accessToken) {
      config.headers!['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  };

  private handleError = async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      console.log('Unauthorized. Refreshing access token');
      const response = await this.authService.refreshAccessToken();
      if (response && response.status === 200) {
        return this.axiosInstance(originalRequest);
      }
    }
    return error;
  };
}
