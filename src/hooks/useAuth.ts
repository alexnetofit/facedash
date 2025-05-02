import React, { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/authService';
import { useFacebookAuth } from './useFacebookAuth';
import { User, AuthState, FacebookAuthResponse } from '../types/auth';
import type { ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  connectFacebook: () => Promise<void>;
  disconnectFacebook: () => Promise<void>;
  loginWithFacebook: () => Promise<AuthState | undefined>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login: facebookLogin, logout: facebookLogout, isInitialized } = useFacebookAuth();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('fb_token');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Se temos um token armazenado, atualize o usuário com ele
          if (storedToken) {
            userData.facebookToken = storedToken;
          }
          setUser(userData);
        } else if (storedToken && isInitialized) {
          // Temos apenas o token do Facebook, tentar fazer login automático
          try {
            await loginWithFacebook();
          } catch (err) {
            console.error('Erro ao fazer login automático com Facebook:', err);
            localStorage.removeItem('fb_token');
          }
        }
      } catch (err) {
        console.error('Erro ao recuperar usuário:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [isInitialized]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const authState = await authService.login(email, password);
      setUser(authState.user);
      localStorage.setItem('user', JSON.stringify(authState.user));
      // Se o usuário tem token do Facebook, armazene separadamente
      if (authState.user.facebookToken) {
        localStorage.setItem('fb_token', authState.user.facebookToken);
      }
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
      localStorage.removeItem('fb_token');
      await facebookLogout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const facebookData = await facebookLogin() as FacebookAuthResponse;
      // Fazer login na API com os dados do Facebook
      const authState = await authService.loginWithFacebook(facebookData);
      const user = authState?.user;
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        // Armazena o token do Facebook separadamente
        if (facebookData.accessToken) {
          localStorage.setItem('fb_token', facebookData.accessToken);
        }
        return authState;
      }
      return undefined;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login com Facebook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const connectFacebook = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const facebookData = await facebookLogin() as FacebookAuthResponse;
      if (user) {
        const updatedUser = await authService.linkFacebookAccount(user.id, facebookData);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Armazena o token do Facebook separadamente
        if (facebookData.accessToken) {
          localStorage.setItem('fb_token', facebookData.accessToken);
        }
      } else {
        // Se não há usuário logado, faça login com Facebook
        await loginWithFacebook();
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
        localStorage.removeItem('fb_token');
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
    loginWithFacebook,
  };

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 