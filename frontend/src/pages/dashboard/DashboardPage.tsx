import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import { useMetricsStore } from '../../store/useMetricsStore';

export const DashboardPage: React.FC = () => {
  const currentMetrics = useMetricsStore((state) => state.currentMetrics);

  if (!currentMetrics) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>در حال دریافت متریگ‌های زنده سرور...</Typography>
        <LinearProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        وضعیت زنده سرور E2EE
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MemoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">مصرف پردازنده (CPU)</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>{currentMetrics.cpuUsagePct.toFixed(1)}%</Typography>
              <LinearProgress variant="determinate" value={currentMetrics.cpuUsagePct} sx={{ mt: 2, height: 6, borderRadius: 3 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SpeedIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">ترافیک پیام‌ها</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>{currentMetrics.messagesPerSec} <Typography component="span" variant="body2">پیام/ثانیه</Typography></Typography>
              <Typography variant="caption" color="text.secondary">{currentMetrics.packetsPerSec} پکت/ثانیه</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">کاربران متصل</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>{currentMetrics.connectedUsers}</Typography>
              <Typography variant="caption" color="text.secondary">روم‌های فعال: {currentMetrics.activeRooms}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon color="error" sx={{ mr: 1 }} />
                <Typography color="text.secondary">رویدادهای امنیتی</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} color="error.main">{currentMetrics.rateLimitHits}</Typography>
              <Typography variant="caption" color="text.secondary">پکت‌های نامعتبر: {currentMetrics.invalidPacketsPerSec}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
