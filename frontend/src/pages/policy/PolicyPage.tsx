import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Switch, FormControlLabel, Slider, Button, Grid, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useMetricsStore } from '../../store/useMetricsStore';
import { useAuthStore } from '../../store/useAuthStore';

export const PolicyPage: React.FC = () => {
  const policy = useMetricsStore((state) => state.policy);
  const setPolicy = useMetricsStore((state) => state.setPolicy);
  const token = useAuthStore((state) => state.token);
  const [localPolicy, setLocalPolicy] = useState(policy);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (policy) setLocalPolicy(policy);
  }, [policy]);

  if (!localPolicy) return null;

  const handleSave = async () => {
    const res = await fetch('/api/v1/admin/policy/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(localPolicy),
    });

    if (res.ok) {
      setPolicy(localPolicy);
      setStatus('پالیسی‌ها اعمال شده و بلافاصله به تمام کلاینت‌ها همگام‌سازی شدند.');
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        مدیریت پالیسی‌های زنده سرور
      </Typography>

      {status && <Alert severity="success" sx={{ mb: 3 }}>{status}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>پالیسی روم‌ها</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={localPolicy.roomCreationEnabled}
                    onChange={(e) => setLocalPolicy({ ...localPolicy, roomCreationEnabled: e.target.checked })}
                  />
                }
                label="امکان ساخت روم عمومی"
              />
              <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>حداکثر کاربر در هر روم: {localPolicy.maxUsersPerRoom}</Typography>
                <Slider
                  value={localPolicy.maxUsersPerRoom}
                  onChange={(_, val) => setLocalPolicy({ ...localPolicy, maxUsersPerRoom: val as number })}
                  min={2}
                  max={200}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>کاهش ترافیک (Slow Mode)</Typography>
              <Typography gutterBottom>تاخیر ارسال پیام: {localPolicy.slowModeMs} میلی‌ثانیه</Typography>
              <Slider
                value={localPolicy.slowModeMs}
                onChange={(_, val) => setLocalPolicy({ ...localPolicy, slowModeMs: val as number })}
                step={300}
                min={0}
                max={3000}
                marks
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" startIcon={<SaveIcon />} onClick={handleSave}>
          ذخیره و برودکست تغییرات
        </Button>
      </Box>
    </Box>
  );
};
