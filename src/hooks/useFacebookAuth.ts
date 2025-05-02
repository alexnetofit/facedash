import { useState, useCallback, useEffect } from 'react';
import { FACEBOOK_CONFIG } from '../config/facebook';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: Function;
  }
}

export const useFacebookAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar SDK do Facebook e verificar status de login
  useEffect(() => {
    const initFacebookSDK = async () => {
      // Verifica se o SDK já está carregado
      if (window.FB) {
        setIsInitialized(true);
        return;
      }

      // Carrega o SDK do Facebook assincronamente
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: FACEBOOK_CONFIG.appId,
          cookie: true,
          xfbml: true,
          version: FACEBOOK_CONFIG.version || 'v18.0',
        });
        setIsInitialized(true);
        
        // Verifica status de login atual
        window.FB.getLoginStatus((response: any) => {
          if (response.status === 'connected') {
            // Usuário já está conectado, podemos recuperar o token
            const token = response.authResponse.accessToken;
            localStorage.setItem('fb_token', token);
          }
        });
      };

      // Carrega o SDK
      (function(d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/pt_BR/sdk.js";
        fjs.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    initFacebookSDK();
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await new Promise((resolve, reject) => {
        window.FB.login((response: any) => {
          if (response.authResponse) {
            // Salvar token no localStorage
            localStorage.setItem('fb_token', response.authResponse.accessToken);
            resolve(response);
          } else {
            reject(new Error('Usuário cancelou o login ou não autorizou totalmente.'));
          }
        }, { scope: FACEBOOK_CONFIG.scope });
      });

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
      localStorage.removeItem('fb_token');
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
    isInitialized
  };
}; 