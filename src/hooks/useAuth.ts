import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type AuthState = {
  loading: boolean;
  error: string | null;
};

export const useAuth = () => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    loading: false,
    error: null,
  });

  const signUp = useCallback(async (email: string, password: string, nome: string) => {
    setState({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Criar perfil do usuário na tabela users
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              nome,
              email,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;
      }

      setState({ loading: false, error: null });
      router.push('/login?created=true');
    } catch (error: any) {
      setState({ loading: false, error: error.message });
    }
  }, [router]);

  const signIn = useCallback(async (email: string, password: string) => {
    setState({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setState({ loading: false, error: null });
      router.push('/dashboard/resumo');
      router.refresh();
    } catch (error: any) {
      setState({ loading: false, error: error.message });
    }
  }, [router]);

  const signOut = useCallback(async () => {
    setState({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setState({ loading: false, error: null });
      router.push('/login');
      router.refresh();
    } catch (error: any) {
      setState({ loading: false, error: error.message });
    }
  }, [router]);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
  };
}; 