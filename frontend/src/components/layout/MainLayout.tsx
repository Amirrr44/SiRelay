import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Chip, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import BlockIcon from '@mui/icons-material/Gavel';
import PolicyIcon from '@mui/icons-material/Tune';
import LogoutIcon from '@mui/icons-material/Logout';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useMetricsStore } from '../../store/useMetricsStore';
import { useAuthStore } from '../../store/useAuthStore';

const drawerWidth = 260;

const menuItems = [
  { text: 'داشبورد عملیاتی', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'مدیریت روم‌ها', icon: <MeetingRoomIcon />, path: '/rooms' },
  { text: 'مدیریت کاربران', icon: <PeopleIcon />, path: '/users' },
  { text: 'مدیریت بن‌ها', icon: <BlockIcon />, path: '/bans' },
  { text: 'پالیسی سرور', icon: <PolicyIcon />, path: '/policy' },
];

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const wsConnected = useMetricsStore((state) => state.wsConnected);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', backgroundImage: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            E2EE Admin Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<SignalCellularAltIcon />}
              label={wsConnected ? 'Live Stream' : 'Connecting...'}
              color={wsConnected ? 'success' : 'error'}
              variant="outlined"
              size="small"
            />
            <Button color="error" startIcon={<LogoutIcon />} onClick={() => { logout(); navigate('/login'); }}>
              خروج
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.default' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2, px: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{ borderRadius: 100 }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)` }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
