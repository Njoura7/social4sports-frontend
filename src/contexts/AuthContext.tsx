/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, userService, RegisterData } from "@/services/userService";
import { AUTH_CONFIG } from "@/config/env";
import { jwtDecode } from "jwt-decode";
export { AuthContext };

const TOKEN_NAME = AUTH_CONFIG.TOKEN_NAME;

interface AuthContextType {
  user: User | null;
  token: string | null; // Added token
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
  token: null, // Added token
  isLoading: true,
  isAuthenticated: false,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  setUser: () => { },
  refreshUserById: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Added token state
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth token and fetch user on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_NAME);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(storedToken);
        const userId = decoded.id;
        const userData = await userService.getUserById(userId);
        setUser(userData);
        setToken(storedToken); // Set token state
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem(TOKEN_NAME);
        setUser(null);
        setToken(null);
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
      setToken(accessToken); // Set token state
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
      const { user, token: newToken } = await userService.register(data);
      localStorage.setItem(TOKEN_NAME, newToken);
      setToken(newToken); // Set token state
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await userService.logout();
    localStorage.removeItem(TOKEN_NAME);
    setUser(null);
    setToken(null); // Clear token state
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // Added token to context value
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