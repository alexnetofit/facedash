import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import { DashboardForm } from './pages/DashboardForm';
import Login from './pages/Login';
import { Integrations } from './pages/Integrations';
import { DashboardIntegrations } from './pages/DashboardIntegrations';
import { DashboardService } from './services/dashboardService';
import { Dashboard as DashboardType } from './types/dashboard';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';

interface Dashboard {
  id: string;
  name: string;
  accounts: string[];
  createdAt: string;
  updatedAt: string;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);

  useEffect(() => {
    // Carregar dashboards do localStorage
    const loadedDashboards = DashboardService.getAll();
    setDashboards(loadedDashboards);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas */}
              <Route element={<PrivateRoute />}>
                <Route element={
                  <Layout dashboards={dashboards}>
                    <Outlet />
                  </Layout>
                }>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Navigate to="/dashboard/default" replace />} />
                  <Route path="/dashboard/new" element={<DashboardForm />} />
                  <Route path="/dashboard/:id" element={<Dashboard />} />
                  <Route path="/dashboard/:id/edit" element={<DashboardForm />} />
                  <Route path="/dashboard/:id/integrations" element={<DashboardIntegrations />} />
                  <Route path="/settings" element={<div>Configurações (Em breve)</div>} />
                  <Route path="/integrations" element={<Integrations />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 