import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, getCurrentUser, setCurrentUser as persistCurrentUser, getAuthToken, setAuthToken } from '../services/api';

export type UserRole = 'ADMIN' | 'ANALYST' | 'VIEWER';

export interface AuthUser {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = getAuthToken();
    const saved = getCurrentUser();
    if (token && saved && saved.username && saved.role) {
      return { username: saved.username, role: saved.role as UserRole };
    }
    // Clean out partial or stale items
    if (!token && saved) {
      persistCurrentUser(null);
    }
    return null;
  });

  const login = async (username: string, password: string): Promise<AuthUser> => {
    const response = await apiService.login({ username, password });
    const authUser: AuthUser = {
      username: response.user.username,
      role: response.user.role as UserRole,
    };
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
