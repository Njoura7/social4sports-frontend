
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, userService } from "@/services/userService";
import { AUTH_CONFIG } from "@/config/env";

const TOKEN_NAME = AUTH_CONFIG.TOKEN_NAME;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
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
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem(TOKEN_NAME);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await userService.login({ email, password });
      localStorage.setItem(TOKEN_NAME, token);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await userService.register({ name, email, password });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
