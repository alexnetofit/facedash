import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, error, isLoading, loginWithFacebook } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(formData.email, formData.password, formData.name);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      // Erro já está sendo tratado no hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#1e1e1e',
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          {isRegister ? 'Criar Conta' : 'Login'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isRegister ? (
              'Criar Conta'
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => setIsRegister(!isRegister)}
            sx={{ color: 'primary.main' }}
          >
            {isRegister
              ? 'Já tem uma conta? Faça login'
              : 'Não tem uma conta? Cadastre-se'}
          </Link>
        </Box>

        {/* Separador e Botão do Facebook */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
          <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
          <Typography sx={{ mx: 1, color: 'text.secondary' }}>OU</Typography>
          <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={
            <svg // Ícone do Facebook (exemplo)
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          }
          onClick={async () => {
            try {
              await loginWithFacebook();
              navigate('/');
            } catch (err) {
              console.error("Falha no login com Facebook:", err);
            }
          }}
          disabled={isLoading}
          sx={{
            borderColor: '#1877F2', // Cor do Facebook
            color: '#1877F2',
            '&:hover': {
              borderColor: '#1877F2',
              backgroundColor: 'rgba(24, 119, 242, 0.08)',
            },
          }}
        >
          {isLoading ? (
             <CircularProgress size={24} color="inherit" />
          ) : (
            'Entrar com Facebook'
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default Login; 