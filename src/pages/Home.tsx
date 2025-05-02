import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DashboardService } from '../services/dashboardService';
import { useAuth } from '../hooks/useAuth';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDashboards = () => {
      try {
        const dashboards = DashboardService.getAll();
        
        if (dashboards.length === 0) {
          // Se não tiver dashboards, redireciona para a página de boas-vindas
          navigate('/welcome');
        } else {
          // Se tiver dashboards, redireciona para o primeiro
          navigate(`/dashboard/${dashboards[0].id}`);
        }
      } catch (err) {
        console.error('Erro ao verificar dashboards:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkDashboards();
    }
  }, [navigate, user]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Carregando...
        </Typography>
        <CircularProgress />
      </Box>
    );
  }

  return null;
}; 