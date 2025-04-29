import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Extension as IntegrationIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface DashboardItem {
  id: string;
  name: string;
}

interface SidebarProps {
  dashboards: DashboardItem[];
  onAddDashboard: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ dashboards, onAddDashboard }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = 280;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a1a',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, mb: 2 }}>
          FaceDash
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      
      <List>
        <Typography
          variant="overline"
          sx={{
            pl: 2,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          Dashboards
          <IconButton
            size="small"
            onClick={onAddDashboard}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <AddIcon />
          </IconButton>
        </Typography>
        
        {dashboards.map((dashboard) => (
          <ListItem
            key={dashboard.id}
            button
            selected={location.pathname === `/dashboard/${dashboard.id}`}
            onClick={() => navigate(`/dashboard/${dashboard.id}`)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={dashboard.name} />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', my: 1 }} />
      
      <List>
        <ListItem
          button
          selected={location.pathname === '/settings'}
          onClick={() => navigate('/settings')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </ListItem>
        
        <ListItem
          button
          selected={location.pathname === '/integrations'}
          onClick={() => navigate('/integrations')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <IntegrationIcon />
          </ListItemIcon>
          <ListItemText primary="Integrações" />
        </ListItem>
      </List>
    </Drawer>
  );
}; 