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
import SettingsIcon from '@mui/icons-material/Settings';
import { useParams, useNavigate } from 'react-router-dom';

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

  const handleNavigateToIntegrations = () => {
    if (id) {
      navigate(`/dashboard/${id}/integrations`);
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <div className="p-6">
        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="min-w-[200px]">
            <Select
              className="w-full bg-dark-surface"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              displayEmpty
            >
              <MenuItem disabled value="">
                Selecione a Conta de Anúncios
              </MenuItem>
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} ({account.account_id})
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
              className="bg-dark-surface"
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
              className="bg-dark-surface"
            />
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
            >
              <FileDownloadIcon />
              Exportar CSV
            </button>
            <button
              onClick={handleNavigateToIntegrations}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
            >
              <SettingsIcon />
              Integrações
            </button>
          </div>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-surface p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Total Gasto</h3>
              <p className="text-3xl font-semibold">{metrics.spend}</p>
              <p className="text-green-500 mt-2">↑ 5.2% vs. período anterior</p>
            </div>
            <div className="bg-dark-surface p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Campanhas Ativas</h3>
              <p className="text-3xl font-semibold">{metrics.activeCampaigns}</p>
              <p className="text-green-500 mt-2">↑ 2.5% vs. período anterior</p>
            </div>
            <div className="bg-dark-surface p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Status das Contas</h3>
              <p className="text-3xl font-semibold">{metrics.activeAccounts} ativas</p>
              <p className="text-green-500 mt-2">↑ 1% vs. período anterior</p>
            </div>
            <div className="bg-dark-surface p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Impressões / Cliques</h3>
              <p className="text-3xl font-semibold">
                {metrics.impressions} / {metrics.clicks}
              </p>
              <p className="text-green-500 mt-2">↑ 3.8% vs. período anterior</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-surface p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">CPA Mensal</h2>
            <CPAChart data={monthlyData} />
          </div>
          <div className="bg-dark-surface p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Gastos por Localização</h2>
            <LocationChart data={locationData} />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Dashboard; 