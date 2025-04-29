import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FacebookAdsService } from '../services/facebookAds';

interface AdAccount {
  id: string;
  name: string;
  account_id: string;
}

interface Metrics {
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
}

const Dashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar contas de anúncio
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accountsData = await FacebookAdsService.getAdAccounts();
        setAccounts(accountsData);
        if (accountsData.length > 0) {
          setSelectedAccount(accountsData[0].id);
        }
      } catch (err) {
        setError('Erro ao carregar contas de anúncio');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  // Carregar métricas quando uma conta é selecionada
  useEffect(() => {
    const loadMetrics = async () => {
      if (!selectedAccount) return;

      setIsLoading(true);
      try {
        const metricsData = await FacebookAdsService.getAccountMetrics(selectedAccount);
        setMetrics(metricsData);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar métricas');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [selectedAccount]);

  if (isLoading && !metrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Selecione a Conta de Anúncios</InputLabel>
          <Select
            value={selectedAccount}
            label="Selecione a Conta de Anúncios"
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name} ({account.account_id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {metrics && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Gasto Total
                </Typography>
                <Typography variant="h4" component="div">
                  {metrics.spend}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Impressões
                </Typography>
                <Typography variant="h4" component="div">
                  {metrics.impressions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Cliques
                </Typography>
                <Typography variant="h4" component="div">
                  {metrics.clicks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  CTR
                </Typography>
                <Typography variant="h4" component="div">
                  {metrics.ctr}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard; 