import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Dev helper
  devLogin: () => void;
}

// Mock user for development
const MOCK_USER: User = {
  id: "mock-user-1",
  email: "test@example.com",
  name: "Test User"
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      setUser(MOCK_USER);
    }
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in dev, accept any credentials
    localStorage.setItem('auth_token', 'mock-token');
    setIsAuthenticated(true);
    setUser(MOCK_USER);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Development helper to quickly login
  const devLogin = () => {
    login('test@example.com', 'password');
  };

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, devLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 