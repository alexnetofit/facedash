// Dados de demonstração para o desenvolvimento
import { Metric } from '@/hooks/useMetrics';

// Função para gerar dados aleatórios entre um intervalo
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

// Gerar dados dos últimos 7 dias para demonstração
export const generateMockMetrics = (userId: string, accountIds: string[]): Metric[] => {
  const metrics: Metric[] = [];
  
  if (!accountIds.length) return metrics;
  
  // Gerar dados para os últimos 7 dias
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    
    // Gerar dados para cada conta
    accountIds.forEach(accountId => {
      metrics.push({
        id: `demo-${accountId}-${formattedDate}`,
        user_id: userId,
        ad_account_id: accountId,
        data: formattedDate,
        spend: Number(randomBetween(100, 1000).toFixed(2)),
        cpm: Number(randomBetween(5, 30).toFixed(2)),
        cpc: Number(randomBetween(0.5, 3).toFixed(2)),
        ctr: Number(randomBetween(0.01, 0.05).toFixed(4)),
        conversions: Math.floor(randomBetween(5, 50)),
      });
    });
  }
  
  return metrics;
};

// Função para inserir dados de demonstração no Supabase
export const insertMockMetricsIfNeeded = async (
  supabaseClient: any, 
  userId: string, 
  accountIds: string[]
): Promise<void> => {
  if (!accountIds.length) return;
  
  // Verificar se já existem métricas para este usuário
  const { data, error } = await supabaseClient
    .from('metrics')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
  
  if (error) {
    console.error('Erro ao verificar métricas existentes:', error);
    return;
  }
  
  // Se não existirem métricas, inserir dados de demonstração
  if (!data || data.length === 0) {
    const mockMetrics = generateMockMetrics(userId, accountIds);
    
    // Inserir em lotes de 10 para evitar limitações de API
    for (let i = 0; i < mockMetrics.length; i += 10) {
      const batch = mockMetrics.slice(i, i + 10);
      
      const { error } = await supabaseClient
        .from('metrics')
        .insert(batch);
      
      if (error) {
        console.error('Erro ao inserir métricas de demonstração:', error);
        return;
      }
    }
    
    console.log(`${mockMetrics.length} métricas de demonstração inseridas com sucesso!`);
  }
}; 