import { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { apiFetch } from '../lib/api';

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
  loginError: string | null;
}

const AuthContext = createContext<ContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  loginError: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setLoginError(null);
      try {
        const result = await apiFetch('/api/auth/verify-token', {
          method: 'POST',
          body: JSON.stringify({ token: response.access_token })
        });

        if (!result.ok) {
          setLoginError(
            result.status === 403
              ? 'Este email não está autorizado.'
              : 'Não foi possível entrar. Tenta novamente.'
          );
          return;
        }

        const data = await result.json();
        localStorage.setItem('session_token', data.sessionToken);
        setUser({ ...data.user, token: data.sessionToken });
      } catch {
        setLoginError('Não foi possível entrar. Tenta novamente.');
      }
    },
    onError: () => {
      setLoginError('Não foi possível entrar. Tenta novamente.');
    },
    flow: 'implicit'
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('session_token');
  };

  useEffect(() => {
    const verifyStoredSession = async () => {
      const token = localStorage.getItem('session_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await apiFetch('/api/auth/verify-session', {
          method: 'POST',
          body: JSON.stringify({ token })
        });

        if (result.ok) {
          const data = await result.json();
          setUser({ ...data.user, token });
        } else {
          localStorage.removeItem('session_token');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Session verification error:', error);
        localStorage.removeItem('session_token');
      }
      setIsLoading(false);
    };

    verifyStoredSession();
  }, []);

  const value = {
    user,
    login,
    logout,
    isLoading,
    loginError
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
