// Definição dos tipos para o Facebook SDK
declare global {
  interface Window {
    FB: {
      init: (options: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (callback: (response: { authResponse?: { accessToken: string } }) => void, options: { scope: string }) => void;
      api: (path: string, callback: (response: any) => void) => void;
      getLoginStatus: (callback: (response: { authResponse?: { accessToken: string } }) => void) => void;
    };
    fbAsyncInit: () => void;
  }
}

const FB_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1067415587608867';

// Inicializar o Facebook SDK
export const initFacebookSDK = (): Promise<void> => {
  return new Promise((resolve) => {
    // Se o SDK já estiver carregado
    if (typeof window !== 'undefined' && window.FB) {
      resolve();
      return;
    }

    // Carregar SDK se estiver no navegador
    if (typeof window !== 'undefined') {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: FB_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v19.0',
        });
        resolve();
      };

      // Carregar o script do Facebook SDK
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/pt_BR/sdk.js';
      document.head.appendChild(script);
    }
  });
};

// Realizar login com Facebook e solicitar permissões
export const loginWithFacebook = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.FB) {
      reject(new Error('Facebook SDK não está inicializado'));
      return;
    }

    window.FB.login((response) => {
      if (response.authResponse) {
        resolve(response.authResponse.accessToken);
      } else {
        reject(new Error('Usuário cancelou o login ou não autorizou o aplicativo'));
      }
    }, { scope: 'ads_read,ads_management' });
  });
};

// Obter contas de anúncios do usuário
export const getAdAccounts = (accessToken: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.FB) {
      reject(new Error('Facebook SDK não está inicializado'));
      return;
    }

    window.FB.api(
      '/me/adaccounts?fields=id,name,account_id,account_status&access_token=' + accessToken,
      (response) => {
        if (response && !response.error) {
          resolve(response.data || []);
        } else {
          reject(new Error(response?.error?.message || 'Erro ao buscar contas de anúncios'));
        }
      }
    );
  });
}; 