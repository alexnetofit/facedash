import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1e1e1e', boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FaceDash
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">{user.name}</Typography>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}; 