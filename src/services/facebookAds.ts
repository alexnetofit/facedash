interface AdAccount {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
}

interface AdMetrics {
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  activeCampaigns: number;
  activeAccounts: number;
  cpa: number;
}

interface LocationData {
  region: string;
  spend: number;
}

interface MonthlyData {
  month: string;
  cpa: number;
}

export const FacebookAdsService = {
  getAdAccounts: () => {
    return new Promise<AdAccount[]>((resolve, reject) => {
      window.FB.api('/me/adaccounts', { fields: 'name,account_id,account_status' }, (response: any) => {
        if (response.error) {
          reject(new Error(response.error.message));
          return;
        }
        
        const accounts = response.data.map((account: any) => ({
          id: account.id,
          name: account.name,
          account_id: account.account_id,
          account_status: account.account_status,
        }));
        
        resolve(accounts);
      });
    });
  },

  getAccountMetrics: (accountId: string, startDate: string, endDate: string) => {
    return new Promise<AdMetrics>((resolve, reject) => {
      window.FB.api(
        `/${accountId}/insights`,
        {
          fields: 'spend,impressions,clicks,ctr,actions,cost_per_action_type',
          time_range: {
            since: startDate,
            until: endDate,
          },
          level: 'account',
        },
        (response: any) => {
          if (response.error) {
            reject(new Error(response.error.message));
            return;
          }

          if (!response.data || response.data.length === 0) {
            resolve({
              spend: '0',
              impressions: '0',
              clicks: '0',
              ctr: '0%',
              activeCampaigns: 0,
              activeAccounts: 0,
              cpa: 0,
            });
            return;
          }

          const metrics = response.data[0];
          const cpa = metrics.cost_per_action_type?.[0]?.value || 0;

          resolve({
            spend: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
              .format(parseFloat(metrics.spend || 0)),
            impressions: new Intl.NumberFormat('pt-BR').format(parseInt(metrics.impressions || 0)),
            clicks: new Intl.NumberFormat('pt-BR').format(parseInt(metrics.clicks || 0)),
            ctr: `${parseFloat(metrics.ctr || 0).toFixed(2)}%`,
            activeCampaigns: 4, // Exemplo fixo, substituir por dados reais
            activeAccounts: 2, // Exemplo fixo, substituir por dados reais
            cpa: parseFloat(cpa),
          });
        }
      );
    });
  },

  getMonthlyData: async (accountId: string): Promise<MonthlyData[]> => {
    // Simulando dados mensais de CPA
    return [
      { month: 'Jan', cpa: 12.5 },
      { month: 'Fev', cpa: 11.2 },
      { month: 'Mar', cpa: 10.1 },
      { month: 'Abr', cpa: 13.4 },
      { month: 'Mai', cpa: 9.8 },
      { month: 'Jun', cpa: 8.5 },
    ];
  },

  getLocationData: async (accountId: string): Promise<LocationData[]> => {
    // Simulando dados de gastos por localização
    return [
      { region: 'São Paulo', spend: 8500 },
      { region: 'Rio de Janeiro', spend: 4200 },
      { region: 'Minas Gerais', spend: 3100 },
      { region: 'Bahia', spend: 2400 },
      { region: 'Rio Grande do Sul', spend: 1800 },
      { region: 'Outros', spend: 1500 },
    ];
  },
}; 