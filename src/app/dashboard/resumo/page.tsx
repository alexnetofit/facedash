'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useMetrics } from '@/hooks/useMetrics';
import { useAccounts } from '@/hooks/useAccounts';
import MetricCard from '@/components/MetricCard';
import Chart from '@/components/Chart';
import { FiDollarSign, FiBarChart2, FiMousePointer, FiPercent, FiCheckCircle } from 'react-icons/fi';
import { insertMockMetricsIfNeeded } from './mockData';

export default function ResumoPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Buscar ID do usuário
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
      }
      
      setIsLoading(false);
    };
    
    fetchUser();
  }, []);
  
  // Buscar contas de anúncios
  const { 
    accounts,
    loading: accountsLoading,
  } = useAccounts(userId || '');
  
  // Filtrar contas selecionadas
  const selectedAccountIds = accounts?.filter(account => account.selecionada).map(account => account.ad_account_id) || [];
  
  // Carregar dados de demonstração
  useEffect(() => {
    if (userId && selectedAccountIds.length > 0) {
      insertMockMetricsIfNeeded(supabase, userId, selectedAccountIds).catch(console.error);
    }
  }, [userId, selectedAccountIds]);
  
  // Buscar métricas
  const {
    metrics,
    chartData,
    isLoading: metricsLoading,
  } = useMetrics(userId || '', selectedAccountIds);
  
  if (isLoading || accountsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Se não houver integração com o Facebook
  if (!accounts || accounts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Bem-vindo ao FaceDash
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Conecte sua conta do Facebook na aba Integrações para visualizar suas métricas de anúncios.
          </p>
          <a 
            href="/dashboard/integracoes" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiBarChart2 className="mr-2" />
            Ir para Integrações
          </a>
        </div>
      </div>
    );
  }
  
  // Se não houver métricas
  if (metricsLoading || !metrics || !metrics.daily || metrics.daily.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Resumo
        </h1>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {selectedAccountIds.length > 0 
              ? 'Ainda não há métricas disponíveis para as contas selecionadas. Os dados serão atualizados automaticamente.'
              : 'Selecione pelo menos uma conta de anúncios na aba Integrações para visualizar as métricas.'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Resumo
      </h1>
      
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard
          title="Gastos"
          value={metrics.weekly.spend.toFixed(2)}
          prefix="R$ "
          icon={<FiDollarSign size={24} />}
        />
        <MetricCard
          title="CPM"
          value={metrics.weekly.cpm.toFixed(2)}
          prefix="R$ "
          icon={<FiBarChart2 size={24} />}
        />
        <MetricCard
          title="CPC"
          value={metrics.weekly.cpc.toFixed(2)}
          prefix="R$ "
          icon={<FiMousePointer size={24} />}
        />
        <MetricCard
          title="CTR"
          value={(metrics.weekly.ctr * 100).toFixed(2)}
          suffix="%"
          icon={<FiPercent size={24} />}
        />
        <MetricCard
          title="Conversões"
          value={metrics.weekly.conversions}
          icon={<FiCheckCircle size={24} />}
        />
      </div>
      
      {/* Gráficos */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Chart
            title="Gastos Diários"
            labels={chartData.labels}
            data={chartData.datasets.spend}
            color="rgb(59, 130, 246)"
            borderColor="rgb(59, 130, 246)"
            bgColor="rgba(59, 130, 246, 0.1)"
          />
          <Chart
            title="CPM"
            labels={chartData.labels}
            data={chartData.datasets.cpm}
            color="rgb(16, 185, 129)"
            borderColor="rgb(16, 185, 129)"
            bgColor="rgba(16, 185, 129, 0.1)"
          />
          <Chart
            title="CPC"
            labels={chartData.labels}
            data={chartData.datasets.cpc}
            color="rgb(245, 158, 11)"
            borderColor="rgb(245, 158, 11)"
            bgColor="rgba(245, 158, 11, 0.1)"
          />
          <Chart
            title="CTR"
            labels={chartData.labels}
            data={chartData.datasets.ctr.map(value => value * 100)}
            color="rgb(139, 92, 246)"
            borderColor="rgb(139, 92, 246)"
            bgColor="rgba(139, 92, 246, 0.1)"
          />
        </div>
      )}
      
      {/* Contas sendo monitoradas */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Contas Monitoradas
        </h2>
        <div className="flex flex-wrap gap-2">
          {accounts
            .filter(account => account.selecionada)
            .map(account => (
              <span 
                key={account.id}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                {account.nome_conta}
              </span>
            ))
          }
        </div>
      </div>
    </div>
  );
} 