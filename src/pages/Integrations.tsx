import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useAuth } from '../hooks/useAuth';

export const Integrations = () => {
  const { user, isLoading, error, connectFacebook, disconnectFacebook } = useAuth();

  const handleFacebookConnection = async () => {
    try {
      await connectFacebook();
    } catch (err) {
      // Erro já está sendo tratado no hook
    }
  };

  const handleFacebookDisconnection = async () => {
    try {
      await disconnectFacebook();
    } catch (err) {
      // Erro já está sendo tratado no hook
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Integrações
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FacebookIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Facebook Ads</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.facebookId
                  ? 'Conectado com o Facebook Ads'
                  : 'Conecte-se ao Facebook Ads para gerenciar suas campanhas'}
              </Typography>
            </Box>
          </Box>

          {isLoading ? (
            <CircularProgress size={24} />
          ) : user?.facebookId ? (
            <Button
              variant="outlined"
              color="error"
              onClick={handleFacebookDisconnection}
              disabled={isLoading}
            >
              Desconectar
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<FacebookIcon />}
              onClick={handleFacebookConnection}
              disabled={isLoading}
            >
              Conectar com Facebook
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}; 