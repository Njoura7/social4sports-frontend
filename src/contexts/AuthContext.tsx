/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, userService, RegisterData } from "@/services/userService";
import { AUTH_CONFIG } from "@/config/env";
import { jwtDecode } from "jwt-decode";

const TOKEN_NAME = AUTH_CONFIG.TOKEN_NAME;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshUserById: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  setUser: () => { },
  refreshUserById: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth token and fetch user on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_NAME);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;
        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem(TOKEN_NAME);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken } = await userService.login({ email, password });
      localStorage.setItem(TOKEN_NAME, accessToken);
      const decoded: any = jwtDecode(accessToken);
      const userId = decoded.id;
      const userData = await userService.getUserById(userId);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const { user, token } = await userService.register(data);
      localStorage.setItem(TOKEN_NAME, token);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await userService.logout();
    localStorage.removeItem(TOKEN_NAME);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setUser,
        refreshUserById: async (id: string) => {
          setIsLoading(true);
          try {
            const userData = await userService.getUserById(id);
            setUser(userData);
          } finally {
            setIsLoading(false);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
