import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const steps = ['Nhập email', 'Xác thực', 'Đặt mật khẩu mới'];

  const handleSendCode = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }
    
    // Giả lập gửi mã xác thực
    console.log('Gửi mã xác thực đến:', email);
    setActiveStep(1);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError('');
    
    if (!verificationCode) {
      setError('Vui lòng nhập mã xác thực');
      return;
    }
    
    // Giả lập xác thực mã
    if (verificationCode === '123456') {
      setActiveStep(2);
    } else {
      setError('Mã xác thực không đúng');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    // Giả lập reset mật khẩu thành công
    console.log('Reset mật khẩu cho:', email);
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LockResetIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h5">
              Đặt lại mật khẩu
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Đặt lại mật khẩu thành công! Đang chuyển hướng...
            </Alert>
          )}

          {/* Bước 1: Nhập email */}
          {activeStep === 0 && (
            <Box component="form" onSubmit={handleSendCode} sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Nhập email đăng ký của bạn. Chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Gửi mã xác thực
              </Button>
            </Box>
          )}

          {/* Bước 2: Nhập mã xác thực */}
          {activeStep === 1 && (
            <Box component="form" onSubmit={handleVerifyCode} sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Chúng tôi đã gửi mã xác thực đến email: <strong>{email}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                (Dùng mã: 123456 để test)
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Mã xác thực"
                name="code"
                autoFocus
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Nhập mã 6 số"
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  fullWidth
                >
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  Xác thực
                </Button>
              </Box>
            </Box>
          )}

          {/* Bước 3: Đặt mật khẩu mới */}
          {activeStep === 2 && (
            <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Nhập mật khẩu mới cho tài khoản của bạn.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="Mật khẩu mới"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Đặt lại mật khẩu
              </Button>
            </Box>
          )}

          <Box textAlign="center" sx={{ mt: 2 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Quay lại đăng nhập
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;