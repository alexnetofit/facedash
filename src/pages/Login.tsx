import React from 'react';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useNavigate } from 'react-router-dom';
import { useFacebookAuth } from '../hooks/useFacebookAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useFacebookAuth();

  const handleFacebookLogin = async () => {
    try {
      await login();
      // Se o login for bem-sucedido, redireciona para o dashboard
      navigate('/dashboard');
    } catch (err) {
      // O erro já está sendo tratado no hook
      console.error('Erro no login:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Facebook Ads Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Conecte-se com sua conta do Facebook para visualizar suas métricas de anúncios
        </Typography>
        
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FacebookIcon />}
          onClick={handleFacebookLogin}
          disabled={isLoading}
          sx={{
            backgroundColor: '#1877f2',
            '&:hover': {
              backgroundColor: '#166fe5',
            },
          }}
        >
          {isLoading ? 'Conectando...' : 'Conectar com Facebook'}
        </Button>
      </Box>
    </Container>
  );
};

export default Login; 