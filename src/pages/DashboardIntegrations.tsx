import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFacebookAuth } from '../hooks/useFacebookAuth';
import { DashboardService } from '../services/dashboardService';
import { FacebookAdsService } from '../services/facebookAds';

interface FacebookAccount {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const DashboardIntegrations = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { login: facebookLogin, isLoading: fbLoading } = useFacebookAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [facebookAccounts, setFacebookAccounts] = useState<FacebookAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  // Carregar dashboard e contas conectadas
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!id) return;
        
        const dashboardData = DashboardService.getById(id);
        if (!dashboardData) {
          setError('Dashboard não encontrado');
          return;
        }
        
        setDashboard(dashboardData);
        
        // Carrega contas do Facebook conectadas a este dashboard
        if (dashboardData.accounts && dashboardData.accounts.length > 0) {
          const accounts = await FacebookAdsService.getAccountsByIds(dashboardData.accounts);
          setFacebookAccounts(accounts);
        }
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboard();
  }, [id]);

  const handleConnectFacebook = async () => {
    try {
      setIsLoading(true);
      // Login no Facebook
      const response = await facebookLogin();
      
      // Após o login, busca as contas disponíveis
      const accounts = await FacebookAdsService.getAdAccounts();
      
      // Abre diálogo para selecionar conta
      if (accounts.length > 0) {
        // Adiciona a primeira conta por padrão (pode ser melhorado para seleção)
        const account = accounts[0];
        if (dashboard && !dashboard.accounts.includes(account.id)) {
          const updatedDashboard = DashboardService.addAccount(dashboard.id, account.id);
          setDashboard(updatedDashboard);
          setFacebookAccounts([...facebookAccounts, {
            id: account.id,
            name: account.name,
            status: 'ACTIVE'
          }]);
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

  const handleToggleAccount = (accountId: string, enabled: boolean) => {
    try {
      if (!dashboard) return;
      
      if (enabled) {
        // Adicionar conta
        const updatedDashboard = DashboardService.addAccount(dashboard.id, accountId);
        setDashboard(updatedDashboard);
      } else {
        // Remover conta
        const updatedDashboard = DashboardService.removeAccount(dashboard.id, accountId);
        setDashboard(updatedDashboard);
        
        // Atualiza a lista de contas
        setFacebookAccounts(facebookAccounts.filter(acc => acc.id !== accountId));
      }
    } catch (err) {
      setError('Erro ao atualizar contas');
      console.error(err);
    }
  };

  const handleAddAccount = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewAccountName('');
  };

  const handleSaveNewAccount = () => {
    if (!newAccountName.trim() || !dashboard) return;
    
    try {
      // Simula a adição de uma nova conta (em um app real, isso seria feito via API)
      const newId = `act_${Date.now()}`;
      const newAccount = {
        id: newId,
        name: newAccountName,
        status: 'ACTIVE' as const
      };
      
      setFacebookAccounts([...facebookAccounts, newAccount]);
      DashboardService.addAccount(dashboard.id, newId);
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao adicionar conta');
      console.error(err);
    }
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
      <Typography variant="h4" gutterBottom>
        Integrações do Dashboard: {dashboard?.name}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FacebookIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Meta Ads</Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<FacebookIcon />}
            onClick={handleConnectFacebook}
            disabled={isLoading || fbLoading}
          >
            Conectar nova conta
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Contas de Anúncio (Meta)
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddAccount}
          >
            Adicionar perfil
          </Button>
        </Box>
        
        {facebookAccounts.length === 0 ? (
          <Typography color="text.secondary">
            Conecte seus perfis por aqui:
          </Typography>
        ) : (
          facebookAccounts.map((account) => (
            <Card key={account.id} sx={{ mb: 2, bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1">{account.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      status: {account.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={dashboard?.accounts.includes(account.id)}
                          onChange={(e) => handleToggleAccount(account.id, e.target.checked)}
                          size="small"
                        />
                      }
                      label=""
                    />
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Adicionar Novo Perfil</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Perfil"
            fullWidth
            variant="outlined"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveNewAccount} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 