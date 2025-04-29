import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import { DashboardForm } from './pages/DashboardForm';
import Login from './pages/Login';
import { DashboardService } from './services/dashboardService';

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
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  useEffect(() => {
    // Carregar dashboards do localStorage
    const loadedDashboards = DashboardService.getAll();
    setDashboards(loadedDashboards);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <Layout dashboards={dashboards}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard/new" element={<DashboardForm />} />
                    <Route path="/dashboard/:id" element={<Dashboard />} />
                    <Route path="/dashboard/:id/edit" element={<DashboardForm />} />
                    <Route path="/settings" element={<div>Configurações (Em breve)</div>} />
                    <Route path="/integrations" element={<div>Integrações (Em breve)</div>} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 