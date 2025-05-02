import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FacebookAdsService } from '../services/facebookAds';
import FacebookIcon from '@mui/icons-material/Facebook';
import { DashboardService } from '../services/dashboardService';
import { useFacebookAuth } from '../hooks/useFacebookAuth';

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
  activeCampaigns: number;
  activeAccounts: number;
  cpa: number;
}

const Dashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { login: facebookLogin } = useFacebookAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dashboard
  useEffect(() => {
    const loadDashboard = () => {
      try {
        if (!id) return;
        
        const dashboardData = DashboardService.getById(id);
        if (!dashboardData) {
          setError('Dashboard não encontrado');
          return;
        }
        
        setDashboard(dashboardData);
      } catch (err) {
        setError('Erro ao carregar dashboard');
        console.error(err);
      }
    };
    
    loadDashboard();
  }, [id]);

  // Carregar contas do Facebook
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        if (!dashboard) return;
        
        if (dashboard.accounts && dashboard.accounts.length > 0) {
          // Já tem contas conectadas
          const accounts = await FacebookAdsService.getAccountsByIds(dashboard.accounts);
          setAccounts(accounts);
          
          if (accounts.length > 0) {
            setSelectedAccount(accounts[0].id);
          }
        }
        
      } catch (err) {
        setError('Erro ao carregar contas');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAccounts();
  }, [dashboard]);

  // Carregar métricas quando uma conta é selecionada
  useEffect(() => {
    const loadMetrics = async () => {
      if (!selectedAccount) return;

      setIsLoading(true);
      try {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const metricsData = await FacebookAdsService.getAccountMetrics(
          selectedAccount,
          format(thirtyDaysAgo, 'yyyy-MM-dd'),
          format(today, 'yyyy-MM-dd')
        );

        setMetrics(metricsData);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar métricas');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedAccount) {
      loadMetrics();
    }
  }, [selectedAccount]);

  const handleConnectFacebook = async () => {
    try {
      setIsLoading(true);
      // Login no Facebook
      await facebookLogin();
      
      // Busca contas do Facebook
      const fbAccounts = await FacebookAdsService.getAdAccounts();
      
      if (fbAccounts.length > 0) {
        setAccounts(fbAccounts);
        setSelectedAccount(fbAccounts[0].id);
        
        // Atualiza o dashboard com a primeira conta
        if (dashboard) {
          const updatedDashboard = DashboardService.update(dashboard.id, {
            accounts: [fbAccounts[0].id]
          });
          setDashboard(updatedDashboard);
        }
      }
      
      setError(null);
    } catch (err) {
      setError('Erro ao conectar com Facebook');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !dashboard) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Se não tem conta do Facebook conectada
  if (dashboard && (!dashboard.accounts || dashboard.accounts.length === 0)) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          {dashboard.name}
        </Typography>
        
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Conecte uma conta do Facebook para começar
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 4 }}>
            Para visualizar os dados das suas campanhas, você precisa conectar uma conta do Facebook Ads.
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<FacebookIcon />}
            onClick={handleConnectFacebook}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Conectar com Facebook'}
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {dashboard?.name}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem disabled value="">
            Selecione a Conta de Anúncios
          </MenuItem>
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {metrics && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Gasto
                </Typography>
                <Typography variant="h5">{metrics.spend}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Impressões
                </Typography>
                <Typography variant="h5">{metrics.impressions}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Cliques
                </Typography>
                <Typography variant="h5">{metrics.clicks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  CTR
                </Typography>
                <Typography variant="h5">{metrics.ctr}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard; 