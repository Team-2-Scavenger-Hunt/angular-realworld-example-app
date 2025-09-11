import React, { createContext, useEffect, useState } from "react";
import { User } from "../../types";
import { jwtService } from "./jwt.service";
import { api } from "../http/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (credentials: {
    username: string;
    email: string;
    password: string;
  }) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<User>;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = jwtService.getToken();
    if (token) {
      getCurrentUser()
        .then(setUser)
        .catch(() => {
          jwtService.destroyToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<{ user: User }>("/user");
    return response.data.user;
  };

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<User> => {
    const response = await api.post<{ user: User }>("/users/login", {
      user: credentials,
    });
    const userData = response.data.user;
    jwtService.saveToken(userData.token);
    setUser(userData);
    return userData;
  };

  const register = async (credentials: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const response = await api.post<{ user: User }>("/users", {
      user: credentials,
    });
    const userData = response.data.user;
    jwtService.saveToken(userData.token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    jwtService.destroyToken();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<{ user: User }>("/user", { user: userData });
    const updatedUser = response.data.user;
    setUser(updatedUser);
    return updatedUser;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
