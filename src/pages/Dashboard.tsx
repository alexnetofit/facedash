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
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { FacebookAdsService } from '../services/facebookAds';
import { CPAChart } from '../components/CPAChart';
import { LocationChart } from '../components/LocationChart';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [monthlyData, setMonthlyData] = useState([]);
  const [locationData, setLocationData] = useState([]);

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

  // Carregar métricas quando uma conta é selecionada ou datas são alteradas
  useEffect(() => {
    const loadData = async () => {
      if (!selectedAccount) return;

      setIsLoading(true);
      try {
        const [metricsData, monthly, location] = await Promise.all([
          FacebookAdsService.getAccountMetrics(
            selectedAccount,
            format(startDate, 'yyyy-MM-dd'),
            format(endDate, 'yyyy-MM-dd')
          ),
          FacebookAdsService.getMonthlyData(selectedAccount),
          FacebookAdsService.getLocationData(selectedAccount),
        ]);

        setMetrics(metricsData);
        setMonthlyData(monthly);
        setLocationData(location);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar métricas');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedAccount, startDate, endDate]);

  const handleExportCSV = () => {
    // Implementar exportação CSV
    console.log('Exportando dados...');
  };

  if (isLoading && !metrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <FormControl sx={{ minWidth: 200 }}>
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

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
            />
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
            >
              Exportar CSV
            </Button>
          </Box>
        </Box>

        {metrics && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Gasto
                  </Typography>
                  <Typography variant="h4" component="div">
                    {metrics.spend}
                  </Typography>
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    ↑ 5.2% vs. período anterior
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Campanhas Ativas
                  </Typography>
                  <Typography variant="h4" component="div">
                    {metrics.activeCampaigns}
                  </Typography>
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    ↑ 2.5% vs. período anterior
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Status das Contas
                  </Typography>
                  <Typography variant="h4" component="div">
                    {metrics.activeAccounts} ativas
                  </Typography>
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    ↑ 1% vs. período anterior
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Impressões / Cliques
                  </Typography>
                  <Typography variant="h4" component="div">
                    {metrics.impressions} / {metrics.clicks}
                  </Typography>
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    ↑ 3.8% vs. período anterior
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <CPAChart data={monthlyData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <LocationChart data={locationData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Dashboard; 