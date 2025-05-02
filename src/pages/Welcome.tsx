import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DashboardService } from '../services/dashboardService';
import { useFacebookAuth } from '../hooks/useFacebookAuth';
import { FacebookAdsService } from '../services/facebookAds';
import FacebookIcon from '@mui/icons-material/Facebook';

export const Welcome = () => {
  const navigate = useNavigate();
  const { login: facebookLogin, isLoading: fbLoading } = useFacebookAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [dashboardName, setDashboardName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  const steps = ['Criar Dashboard', 'Conectar Facebook'];

  const handleDashboardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDashboardName(e.target.value);
  };

  const handleCreateDashboard = async () => {
    if (!dashboardName.trim()) {
      setError('Por favor, insira um nome para o dashboard');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Cria o dashboard
      const newDashboard = DashboardService.create(dashboardName, []);
      setActiveStep(1);
    } catch (err) {
      setError('Erro ao criar dashboard');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectFacebook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Login no Facebook
      await facebookLogin();
      
      // Busca contas do Facebook
      const fbAccounts = await FacebookAdsService.getAdAccounts();
      setAccounts(fbAccounts);
      
      // Seleciona a primeira conta por padrão
      if (fbAccounts.length > 0) {
        const accountIds = [fbAccounts[0].id];
        setSelectedAccounts(accountIds);
        
        // Atualiza o dashboard com a conta selecionada
        const dashboards = DashboardService.getAll();
        if (dashboards.length > 0) {
          const dashboard = dashboards[dashboards.length - 1]; // Pega o último dashboard criado
          DashboardService.update(dashboard.id, { accounts: accountIds });
          
          // Redireciona para o dashboard
          navigate(`/dashboard/${dashboard.id}`);
        }
      } else {
        // Se não tiver contas, vai para o dashboard vazio
        const dashboards = DashboardService.getAll();
        if (dashboards.length > 0) {
          navigate(`/dashboard/${dashboards[dashboards.length - 1].id}`);
        }
      }
    } catch (err) {
      setError('Erro ao conectar com Facebook');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipFacebook = () => {
    const dashboards = DashboardService.getAll();
    if (dashboards.length > 0) {
      navigate(`/dashboard/${dashboards[dashboards.length - 1].id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Bem-vindo ao FaceDash
      </Typography>
      
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Vamos configurar seu primeiro dashboard para começar.
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 4 }}>
        {activeStep === 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Dê um nome para seu dashboard
            </Typography>
            
            <TextField
              fullWidth
              label="Nome do Dashboard"
              value={dashboardName}
              onChange={handleDashboardNameChange}
              margin="normal"
              variant="outlined"
              autoFocus
            />
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleCreateDashboard}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Continuar'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Conectar sua conta do Facebook
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3 }}>
              Conecte sua conta do Facebook para importar os dados das suas campanhas de anúncios.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
              <Button
                variant="contained"
                startIcon={<FacebookIcon />}
                onClick={handleConnectFacebook}
                disabled={isLoading || fbLoading}
                fullWidth
              >
                {isLoading ? <CircularProgress size={24} /> : 'Conectar com Facebook'}
              </Button>
              
              <Button
                variant="text"
                onClick={handleSkipFacebook}
                disabled={isLoading}
              >
                Pular (conectar depois)
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}; 