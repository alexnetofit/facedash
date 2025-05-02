import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { DashboardService } from '../services/dashboardService';
import { Dashboard } from '../types/dashboard';

export const Integrations = () => {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboards = () => {
      try {
        const loadedDashboards = DashboardService.getAll();
        setDashboards(loadedDashboards);
      } catch (err) {
        setError('Erro ao carregar dashboards');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboards();
  }, []);

  const handleNavigateToDashboard = (id: string) => {
    navigate(`/dashboard/${id}`);
  };

  const handleNavigateToIntegrations = (id: string) => {
    navigate(`/dashboard/${id}/integrations`);
  };

  const handleCreateDashboard = () => {
    navigate('/dashboard/new');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboards e Integrações
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDashboard}
        >
          Novo Dashboard
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {dashboards.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Você ainda não tem dashboards
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Crie seu primeiro dashboard para gerenciar integrações com o Facebook Ads.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateDashboard}
          >
            Criar Dashboard
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {dashboards.map((dashboard) => (
            <Grid item xs={12} md={6} lg={4} key={dashboard.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DashboardIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{dashboard.name}</Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {dashboard.accounts.length === 0 
                      ? 'Nenhuma conta conectada' 
                      : `${dashboard.accounts.length} conta(s) conectada(s)`}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleNavigateToDashboard(dashboard.id)}
                    >
                      Ver Dashboard
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small"
                      startIcon={<SettingsIcon />}
                      onClick={() => handleNavigateToIntegrations(dashboard.id)}
                    >
                      Integrações
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}; 