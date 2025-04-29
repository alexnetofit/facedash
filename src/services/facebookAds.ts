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
    return new Promise((resolve, reject) => {
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);

      window.FB.api(
        `/${accountId}/insights`,
        {
          fields: 'spend,actions',
          time_range: {
            since: sixMonthsAgo.toISOString().split('T')[0],
            until: today.toISOString().split('T')[0],
          },
          time_increment: 1,
          level: 'account',
        },
        (response: any) => {
          if (response.error) {
            reject(new Error(response.error.message));
            return;
          }

          const monthlyData = response.data.map((item: any) => {
            const date = new Date(item.date_start);
            const month = date.toLocaleString('pt-BR', { month: 'short' });
            const actions = item.actions?.[0]?.value || 0;
            const spend = parseFloat(item.spend || 0);
            const cpa = actions > 0 ? spend / actions : 0;

            return {
              month,
              cpa: parseFloat(cpa.toFixed(2)),
            };
          });

          resolve(monthlyData);
        }
      );
    });
  },

  getLocationData: async (accountId: string, startDate: string, endDate: string): Promise<LocationData[]> => {
    return new Promise((resolve, reject) => {
      window.FB.api(
        `/${accountId}/insights`,
        {
          fields: 'spend',
          time_range: {
            since: startDate,
            until: endDate,
          },
          breakdowns: ['region'],
          level: 'account',
        },
        (response: any) => {
          if (response.error) {
            reject(new Error(response.error.message));
            return;
          }

          const locationData = response.data
            .map((item: any) => ({
              region: item.region,
              spend: parseFloat(item.spend || 0),
            }))
            .sort((a: LocationData, b: LocationData) => b.spend - a.spend);

          // Agrupa regiões menores em "Outros"
          const topRegions = locationData.slice(0, 5);
          const otherRegions = locationData.slice(5);
          
          if (otherRegions.length > 0) {
            const otherSpend = otherRegions.reduce((sum: number, item: LocationData) => sum + item.spend, 0);
            topRegions.push({
              region: 'Outros',
              spend: otherSpend,
            });
          }

          resolve(topRegions);
        }
      );
    });
  },
}; 