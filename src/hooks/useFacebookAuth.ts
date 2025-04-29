import { useState, useCallback } from 'react';
import { FACEBOOK_CONFIG } from '../config/facebook';

declare global {
  interface Window {
    FB: any;
  }
}

export const useFacebookAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await new Promise((resolve, reject) => {
        window.FB.login((response: any) => {
          if (response.authResponse) {
            resolve(response);
          } else {
            reject(new Error('Usuário cancelou o login ou não autorizou totalmente.'));
          }
        }, { scope: FACEBOOK_CONFIG.scope });
      });

      // Aqui você pode adicionar lógica adicional após o login bem-sucedido
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login com Facebook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    return new Promise((resolve) => {
      window.FB.logout(() => {
        resolve(true);
      });
    });
  }, []);

  return {
    login,
    logout,
    isLoading,
    error,
  };
}; 