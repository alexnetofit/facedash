import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  dashboards: Array<{
    id: string;
    name: string;
  }>;
}

export const Layout: React.FC<LayoutProps> = ({ children, dashboards }) => {
  const navigate = useNavigate();

  const handleAddDashboard = () => {
    // Aqui você pode abrir um modal para criar um novo dashboard
    // Por enquanto, vamos apenas navegar para uma página de criação
    navigate('/dashboard/new');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
      <Sidebar dashboards={dashboards} onAddDashboard={handleAddDashboard} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#121212',
          color: 'white',
          marginLeft: '280px', // Mesmo valor que drawerWidth
        }}
      >
        {children}
      </Box>
    </Box>
  );
}; 