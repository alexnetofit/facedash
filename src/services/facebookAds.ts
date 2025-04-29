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

  getAccountMetrics: (accountId: string) => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const dateFormat = (date: Date) => date.toISOString().split('T')[0];

    return new Promise<AdMetrics>((resolve, reject) => {
      window.FB.api(
        `/${accountId}/insights`,
        {
          fields: 'spend,impressions,clicks,ctr',
          time_range: {
            since: dateFormat(thirtyDaysAgo),
            until: dateFormat(today),
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
            });
            return;
          }

          const metrics = response.data[0];
          resolve({
            spend: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
              .format(parseFloat(metrics.spend || 0)),
            impressions: new Intl.NumberFormat('pt-BR').format(parseInt(metrics.impressions || 0)),
            clicks: new Intl.NumberFormat('pt-BR').format(parseInt(metrics.clicks || 0)),
            ctr: `${parseFloat(metrics.ctr || 0).toFixed(2)}%`,
          });
        }
      );
    });
  },
}; 