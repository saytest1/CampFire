import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const StartPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Chào mừng đến CampFire
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Nền tảng cho thuê thiết bị cắm trại
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            size="large"
            sx={{ mr: 2 }}
          >
            Đăng nhập
          </Button>
          <Button 
            component={Link} 
            to="/register" 
            variant="outlined" 
            size="large"
          >
            Đăng ký
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StartPage;