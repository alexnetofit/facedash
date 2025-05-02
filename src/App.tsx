import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import { SimpleLayout } from './components/SimpleLayout';
import { Home } from './pages/Home';
import { Welcome } from './pages/Welcome';

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
                  <SimpleLayout>
                    <Outlet />
                  </SimpleLayout>
                }>
                  <Route path="/" element={<Home />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/dashboard/:id" element={<Dashboard />} />
                </Route>
              </Route>

              {/* Rota padrão - redireciona para home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 