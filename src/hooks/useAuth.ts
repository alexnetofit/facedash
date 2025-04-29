import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/authService';
import { useFacebookAuth } from './useFacebookAuth';
import { User, AuthState } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  connectFacebook: () => Promise<void>;
  disconnectFacebook: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login: facebookLogin, logout: facebookLogout } = useFacebookAuth();

  useEffect(() => {
    // Verifica se há um usuário logado ao iniciar
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Erro ao recuperar usuário:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const authState = await authService.login(email, password);
      setUser(authState.user);
      localStorage.setItem('user', JSON.stringify(authState.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const authState = await authService.register(email, password, name);
      setUser(authState.user);
      localStorage.setItem('user', JSON.stringify(authState.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('user');
      await facebookLogout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout');
    } finally {
      setIsLoading(false);
    }
  };

  const connectFacebook = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const facebookData = await facebookLogin();
      if (user) {
        const updatedUser = await authService.linkFacebookAccount(user.id, facebookData);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar com Facebook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFacebook = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (user) {
        const updatedUser = await authService.unlinkFacebookAccount(user.id);
        await facebookLogout();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desconectar do Facebook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    connectFacebook,
    disconnectFacebook,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 