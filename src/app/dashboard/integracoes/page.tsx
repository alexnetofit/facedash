'use client';

import { useState, useEffect } from 'react';
import { FiFacebook } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { initFacebookSDK, loginWithFacebook } from '@/lib/facebook';
import { useAccounts } from '@/hooks/useAccounts';
import AccountSelect from '@/components/AccountSelect';

export default function IntegracoesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [facebookStatus, setFacebookStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  
  // Buscar informações do usuário
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        
        // Buscar nome do usuário no Supabase
        const { data: userData } = await supabase
          .from('users')
          .select('nome, facebook_user_id, facebook_access_token')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          setUserName(userData.nome);
          
          // Verificar se já tem conexão com Facebook
          if (userData.facebook_user_id && userData.facebook_access_token) {
            setFacebookStatus('connected');
          }
        }
      }
      
      setIsLoading(false);
      
      // Inicializar Facebook SDK
      try {
        await initFacebookSDK();
      } catch (error) {
        console.error('Erro ao inicializar Facebook SDK:', error);
      }
    };
    
    fetchUser();
  }, []);
  
  // Hooks para gerenciar contas
  const { 
    accounts,
    loading: accountsLoading,
    error: accountsError,
    saveAccountsFromFacebook,
    toggleAccountSelection
  } = useAccounts(userId || '');
  
  // Função para conectar com Facebook
  const handleConnectFacebook = async () => {
    setFacebookStatus('connecting');
    setError(null);
    
    try {
      // Fazer login com Facebook e obter token
      const accessToken = await loginWithFacebook();
      
      // Enviar token para a API
      const response = await fetch('/api/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar solicitação');
      }
      
      // Buscar e salvar contas de anúncios
      await saveAccountsFromFacebook(accessToken, data.facebookUserId);
      
      setFacebookStatus('connected');
    } catch (error: any) {
      console.error('Erro ao conectar com o Facebook:', error);
      setError(error.message);
      setFacebookStatus('disconnected');
    }
  };
  
  // Função para desconectar do Facebook
  const handleDisconnectFacebook = async () => {
    try {
      // Atualizar usuário no Supabase
      await supabase
        .from('users')
        .update({
          facebook_user_id: null,
          facebook_access_token: null,
        })
        .eq('id', userId);
      
      // Remover contas de anúncios
      await supabase
        .from('ad_accounts')
        .delete()
        .eq('user_id', userId);
      
      setFacebookStatus('disconnected');
    } catch (error: any) {
      console.error('Erro ao desconectar Facebook:', error);
      setError(error.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Integrações
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Cartão de integração do Facebook */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-300 mr-4">
              <FiFacebook size={24} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Facebook Ads</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Conecte sua conta do Facebook para visualizar métricas de anúncios
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {facebookStatus === 'disconnected' ? (
            <div>
              <button
                onClick={handleConnectFacebook}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Conectar com Facebook
              </button>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Ao conectar, você autoriza o FaceDash a acessar suas contas de anúncios.
              </p>
            </div>
          ) : facebookStatus === 'connecting' ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
              <span>Conectando...</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <span className="mr-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-full">
                  Conectado
                </span>
                <button
                  onClick={handleDisconnectFacebook}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Desconectar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Seleção de contas (mostrar apenas se conectado) */}
      {facebookStatus === 'connected' && (
        <>
          {accountsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : accounts && accounts.length > 0 ? (
            <AccountSelect 
              accounts={accounts} 
              onToggle={toggleAccountSelection}
              isLoading={accountsLoading}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Nenhuma conta de anúncios encontrada. Certifique-se de que sua conta do Facebook tem acesso a contas de anúncios.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 