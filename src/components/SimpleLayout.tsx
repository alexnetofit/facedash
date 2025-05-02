import React from 'react';
import { Box } from '@mui/material';
import { TopBar } from './TopBar';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

export const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#121212' }}>
      <TopBar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: '#121212',
          color: 'white',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}; 