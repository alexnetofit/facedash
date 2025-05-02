import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdAccounts } from '@/lib/facebook';
import useSWR from 'swr';

type Account = {
  id: string;
  user_id: string;
  ad_account_id: string;
  nome_conta: string;
  selecionada: boolean;
  created_at: string;
};

export const useAccounts = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetcher para SWR
  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  };

  // Usar SWR para buscar e cachear as contas
  const { data: accounts, mutate: refetchAccounts } = useSWR<Account[]>(
    userId ? `ad_accounts/${userId}` : null,
    fetchAccounts,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Salvar contas do Facebook no Supabase
  const saveAccountsFromFacebook = useCallback(async (accessToken: string, facebookUserId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Buscar contas de anúncios do Facebook
      const fbAccounts = await getAdAccounts(accessToken);
      
      if (!fbAccounts.length) {
        setError('Nenhuma conta de anúncios encontrada no Facebook');
        setLoading(false);
        return [];
      }

      // Atualizar usuário com ID do Facebook
      await supabase
        .from('users')
        .update({
          facebook_user_id: facebookUserId,
          facebook_access_token: accessToken,
        })
        .eq('id', userId);

      // Mapear contas para o formato do Supabase
      const accountsToInsert = fbAccounts.map(account => ({
        user_id: userId,
        ad_account_id: account.account_id,
        nome_conta: account.name,
        selecionada: true,
      }));

      // Inserir contas no Supabase
      const { data, error } = await supabase
        .from('ad_accounts')
        .upsert(accountsToInsert, {
          onConflict: 'user_id,ad_account_id',
          ignoreDuplicates: false,
        });

      if (error) throw error;

      // Atualizar cache do SWR
      await refetchAccounts();
      
      setLoading(false);
      return data || [];
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      return [];
    }
  }, [userId, refetchAccounts]);

  // Alterar seleção de conta
  const toggleAccountSelection = useCallback(async (accountId: string, selected: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('ad_accounts')
        .update({ selecionada: selected })
        .eq('id', accountId)
        .eq('user_id', userId);

      if (error) throw error;

      // Atualizar cache do SWR
      await refetchAccounts();
      
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, [userId, refetchAccounts]);

  return {
    accounts,
    loading,
    error,
    saveAccountsFromFacebook,
    toggleAccountSelection,
    refetchAccounts,
  };
}; 