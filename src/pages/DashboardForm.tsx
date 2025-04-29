import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardService } from '../services/dashboardService';
import { FacebookAdsService } from '../services/facebookAds';

export const DashboardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar contas disponíveis
        const accounts = await FacebookAdsService.getAdAccounts();
        setAvailableAccounts(accounts);

        // Se estiver editando, carregar dados do dashboard
        if (id && id !== 'new') {
          const dashboard = DashboardService.getById(id);
          if (dashboard) {
            setName(dashboard.name);
            setSelectedAccounts(dashboard.accounts);
          }
        }
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (id && id !== 'new') {
        // Atualizar dashboard existente
        DashboardService.update(id, {
          name,
          accounts: selectedAccounts,
        });
      } else {
        // Criar novo dashboard
        DashboardService.create(name, selectedAccounts);
      }

      navigate('/');
    } catch (err) {
      setError('Erro ao salvar dashboard');
      console.error(err);
    }
  };

  const handleAccountChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedAccounts(event.target.value as string[]);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, backgroundColor: '#1e1e1e' }}>
        <Typography variant="h5" gutterBottom>
          {id && id !== 'new' ? 'Editar Dashboard' : 'Novo Dashboard'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nome do Dashboard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Contas de Anúncio</InputLabel>
            <Select
              multiple
              value={selectedAccounts}
              onChange={handleAccountChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((accountId) => {
                    const account = availableAccounts.find(a => a.id === accountId);
                    return (
                      <Chip
                        key={accountId}
                        label={account ? account.name : accountId}
                        sx={{ backgroundColor: '#2e2e2e' }}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {availableAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!name || selectedAccounts.length === 0}
            >
              Salvar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}; 