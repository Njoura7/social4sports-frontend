
import { api } from "./api";

// Types
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  location?: string;
  bio?: string;
  skillLevel?: string;
  playStyle?: string;
  availability?: string;
  profileImage?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// User API Services
export const userService = {
  // Authentication
  login: (credentials: LoginCredentials) => 
    api.post<{ user: User; token: string }>("/auth/login", credentials),
  
  register: (data: RegisterData) => 
    api.post<{ user: User; token: string }>("/auth/register", data),
  
  logout: () => {
    localStorage.removeItem("authToken");
    return Promise.resolve();
  },
  
  // User profile
  getCurrentUser: () => 
    api.get<User>("/users/profile"),
  
  getUserById: (userId: string) => 
    api.get<User>(`/users/${userId}`),
  
  updateProfile: (data: Partial<User>) => 
    api.put<User>("/users/profile", data),
};
