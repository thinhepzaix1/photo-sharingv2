import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Grid,
} from '@mui/material';

function LoginRegister() {
  const [activeTab, setActiveTab] = useState(0);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // State cho form đăng nhập
  const [loginForm, setLoginForm] = useState({
    login_name: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');

  // State cho form đăng ký
  const [registerForm, setRegisterForm] = useState({
    login_name: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    location: '',
    description: '',
    occupation: '',
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Xử lý chuyển tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setLoginError('');
    setRegisterError('');
    setRegisterSuccess('');
  };

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginForm.login_name || !loginForm.password) {
      setLoginError('Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }

    const result = await login(loginForm.login_name, loginForm.password);
    
    if (!result.success) {
      setLoginError(result.error);
    } else {
      navigate('/users/' + result.user._id);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    // Kiểm tra các trường bắt buộc
    if (!registerForm.login_name || !registerForm.password || !registerForm.first_name || !registerForm.last_name) {
      setRegisterError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Gửi yêu cầu đăng ký
    const { confirmPassword, ...userData } = registerForm;
    const result = await register(userData);

    if (!result.success) {
      setRegisterError(result.error);
    } else {
      setRegisterSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setRegisterForm({
        login_name: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: '',
      });
      setActiveTab(0); // Chuyển về tab đăng nhập
    }
  };

  // Cập nhật form đăng nhập
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  // Cập nhật form đăng ký
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Đăng nhập" />
        <Tab label="Đăng ký" />
      </Tabs>

      {/* Tab Đăng nhập */}
      {activeTab === 0 && (
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
          {registerSuccess && <Alert severity="success" sx={{ mb: 2 }}>{registerSuccess}</Alert>}
          
          <TextField
            fullWidth
            margin="normal"
            label="Tên đăng nhập"
            name="login_name"
            value={loginForm.login_name}
            onChange={handleLoginChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Mật khẩu"
            name="password"
            type="password"
            value={loginForm.password}
            onChange={handleLoginChange}
          />
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
          >
            Đăng nhập
          </Button>
        </Box>
      )}

      {/* Tab Đăng ký */}
      {activeTab === 1 && (
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
          {registerError && <Alert severity="error" sx={{ mb: 2 }}>{registerError}</Alert>}
          
          <Typography variant="subtitle1" gutterBottom>
            Thông tin đăng nhập
          </Typography>
          
          <TextField
            fullWidth
            margin="normal"
            label="Tên đăng nhập *"
            name="login_name"
            value={registerForm.login_name}
            onChange={handleRegisterChange}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Mật khẩu *"
                name="password"
                type="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Xác nhận mật khẩu *"
                name="confirmPassword"
                type="password"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
              />
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Thông tin cá nhân
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Họ *"
                name="first_name"
                value={registerForm.first_name}
                onChange={handleRegisterChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Tên *"
                name="last_name"
                value={registerForm.last_name}
                onChange={handleRegisterChange}
              />
            </Grid>
          </Grid>
          
          <TextField
            fullWidth
            margin="normal"
            label="Địa điểm"
            name="location"
            value={registerForm.location}
            onChange={handleRegisterChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Nghề nghiệp"
            name="occupation"
            value={registerForm.occupation}
            onChange={handleRegisterChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Mô tả"
            name="description"
            multiline
            rows={3}
            value={registerForm.description}
            onChange={handleRegisterChange}
          />
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
          >
            Đăng ký
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default LoginRegister;