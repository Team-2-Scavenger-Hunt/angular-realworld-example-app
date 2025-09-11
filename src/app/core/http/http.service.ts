import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import AxiosConfig from "./axios.config";
import { JwtService } from "../auth/services/jwt.service";

@Injectable({ providedIn: "root" })
export class HttpService {
  private axiosConfig: AxiosConfig;

  constructor(private jwtService: JwtService) {
    this.axiosConfig = new AxiosConfig(jwtService);
  }

  get<T>(url: string, params?: any): Observable<T> {
    return from(this.axiosConfig.getInstance().get(url, { params })).pipe(
      map((response: any) => response.data),
    );
  }

  post<T>(url: string, data?: any): Observable<T> {
    return from(this.axiosConfig.getInstance().post(url, data)).pipe(
      map((response: any) => response.data),
    );
  }

  put<T>(url: string, data?: any): Observable<T> {
    return from(this.axiosConfig.getInstance().put(url, data)).pipe(
      map((response: any) => response.data),
    );
  }

  delete<T>(url: string): Observable<T> {
    return from(this.axiosConfig.getInstance().delete(url)).pipe(
      map((response: any) => response.data),
    );
  }
}
