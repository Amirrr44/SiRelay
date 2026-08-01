import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAuth(data.token);
        navigate('/dashboard');
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور.');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <LockOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>ورود به پنل مدیریت E2EE</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField fullWidth label="نام کاربری" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" />
            <TextField fullWidth type="password" label="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }}>ورود به سیستم</Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
