import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import useSWR from 'swr';

export type Metric = {
  id: string;
  user_id: string;
  ad_account_id: string;
  data: string;
  spend: number;
  cpm: number;
  cpc: number;
  ctr: number;
  conversions: number;
};

type MetricsResult = {
  daily: Metric[];
  weekly: {
    spend: number;
    cpm: number;
    cpc: number;
    ctr: number;
    conversions: number;
  };
};

export const useMetrics = (userId: string, selectedAccountIds: string[] = []) => {
  // Não buscar métricas se não houver contas selecionadas
  const shouldFetch = userId && selectedAccountIds.length > 0;

  // Função para buscar métricas diárias e calcular semanais
  const fetchMetrics = async (): Promise<MetricsResult> => {
    if (!shouldFetch) return { daily: [], weekly: { spend: 0, cpm: 0, cpc: 0, ctr: 0, conversions: 0 } };

    // Buscar últimos 7 dias de métricas
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('user_id', userId)
      .in('ad_account_id', selectedAccountIds)
      .gte('data', startDate.toISOString().split('T')[0])
      .lte('data', endDate.toISOString().split('T')[0])
      .order('data', { ascending: false });

    if (error) throw error;

    // Calcular métricas semanais (média)
    const metrics = data || [];
    
    const weekly = metrics.reduce((acc, metric) => {
      acc.spend += metric.spend;
      acc.cpm += metric.cpm;
      acc.cpc += metric.cpc;
      acc.ctr += metric.ctr;
      acc.conversions += metric.conversions;
      return acc;
    }, { spend: 0, cpm: 0, cpc: 0, ctr: 0, conversions: 0 });

    // Calcular médias
    if (metrics.length > 0) {
      weekly.cpm = weekly.cpm / metrics.length;
      weekly.cpc = weekly.cpc / metrics.length;
      weekly.ctr = weekly.ctr / metrics.length;
    }

    return { daily: metrics, weekly };
  };

  // Usar SWR para buscar e cachear as métricas
  const { data, error, isLoading, mutate } = useSWR<MetricsResult>(
    shouldFetch ? `metrics/${userId}/${selectedAccountIds.join(',')}` : null,
    fetchMetrics,
    {
      revalidateOnFocus: false,
      refreshInterval: 3600000, // Atualizar a cada 1 hora
    }
  );

  // Dados formatados para gráficos
  const getChartData = useCallback(() => {
    if (!data?.daily || data.daily.length === 0) return null;

    // Agrupar por data
    const groupedByDate = data.daily.reduce((acc, metric) => {
      const date = metric.data;
      if (!acc[date]) {
        acc[date] = {
          spend: 0,
          cpm: 0,
          cpc: 0,
          ctr: 0,
          conversions: 0,
          count: 0,
        };
      }
      
      acc[date].spend += metric.spend;
      acc[date].cpm += metric.cpm;
      acc[date].cpc += metric.cpc;
      acc[date].ctr += metric.ctr;
      acc[date].conversions += metric.conversions;
      acc[date].count += 1;
      
      return acc;
    }, {} as Record<string, { spend: number; cpm: number; cpc: number; ctr: number; conversions: number; count: number }>);

    // Ordenar por data e calcular médias
    const sortedDates = Object.keys(groupedByDate).sort();
    
    // Formatar dados para gráficos
    return {
      labels: sortedDates,
      datasets: {
        spend: sortedDates.map(date => groupedByDate[date].spend),
        cpm: sortedDates.map(date => groupedByDate[date].cpm / groupedByDate[date].count),
        cpc: sortedDates.map(date => groupedByDate[date].cpc / groupedByDate[date].count),
        ctr: sortedDates.map(date => groupedByDate[date].ctr / groupedByDate[date].count),
        conversions: sortedDates.map(date => groupedByDate[date].conversions),
      }
    };
  }, [data]);

  return {
    metrics: data,
    chartData: getChartData(),
    isLoading,
    error,
    refetch: mutate,
  };
}; 