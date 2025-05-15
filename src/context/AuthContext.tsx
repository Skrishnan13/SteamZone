
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: { username: string } | null;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean; // To handle initial auth state check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true until checked
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for persisted login state (e.g., from localStorage)
    // For this prototype, we'll just assume the user starts logged out.
    // In a real app, you might check localStorage or a session cookie here.
    // For simplicity, we'll just mark loading as false after a brief moment.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Short delay to simulate async check
    return () => clearTimeout(timer);
  }, []);

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    // IMPORTANT: THIS IS HIGHLY INSECURE AND FOR PROTOTYPING ONLY
    // In a real application, never hardcode credentials or validate them on the client-side.
    if (usernameInput === 'admin' && passwordInput === 'Pass@123') {
      setCurrentUser({ username: 'admin' });
      return true;
    }
    // Simulate network delay for failed login
    await new Promise(resolve => setTimeout(resolve, 500));
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    // Optionally clear any persisted state (e.g., localStorage.removeItem('user'))
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
