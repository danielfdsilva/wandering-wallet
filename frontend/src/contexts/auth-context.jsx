import { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: response.access_token }),
        });

        if (!result.ok) {
          throw new Error('Authentication failed');
        }

        const data = await result.json();
        setUser(data.user);
        localStorage.setItem('auth_token', response.access_token);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    flow: 'implicit',
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  useEffect(() => {
    const verifyStoredToken = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (result.ok) {
          const data = await result.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('auth_token');
      }
      setIsLoading(false);
    };

    verifyStoredToken();
  }, []);

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
