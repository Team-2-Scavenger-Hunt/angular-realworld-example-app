import axios from "axios";
import { JwtService } from "../auth/services/jwt.service";

class AxiosConfig {
  private axiosInstance: any;
  private jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
    this.axiosInstance = axios.create({
      baseURL: "https://api.realworld.show/api",
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        const token = this.jwtService.getToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Token ${token}`,
          };
        }
        return config;
      },
      (error: any) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        return Promise.reject(error.response?.data || error);
      },
    );
  }

  getInstance(): any {
    return this.axiosInstance;
  }
}

export default AxiosConfig;
