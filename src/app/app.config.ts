import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { JwtService } from "./core/auth/services/jwt.service";
import { UserService } from "./core/auth/services/user.service";
import { EMPTY } from "rxjs";

export function initAuth(jwtService: JwtService, userService: UserService) {
  return () => (jwtService.getToken() ? userService.getCurrentUser() : EMPTY);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAppInitializer(() => {
      const initializerFn = initAuth(inject(JwtService), inject(UserService));
      return initializerFn();
    }),
  ],
};
