import { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

interface ContextType {
  user: {
    email: string;
    name: string;
    picture: string;
    token: string;
  } | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<ContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const token = response.access_token;
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        }
      );

      if (!result.ok) {
        throw new Error('Authentication failed');
      }

      const data = await result.json();
      setUser({ ...data.user, token });
      localStorage.setItem('auth_token', token);
    },
    flow: 'implicit'
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
        const result = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          }
        );

        if (result.ok) {
          const data = await result.json();
          setUser({ ...data.user, token });
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
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
    isLoading
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
