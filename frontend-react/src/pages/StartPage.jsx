import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'linear-gradient(to right, #a8edea, #fed6e3)',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h2" fontWeight="bold" color="primary">
        CAMPFIRE SHOP
      </Typography>
      <Typography variant="h6" color="text.secondary" mt={2}>
        All You Need for the Perfect Outdoor Adventure
      </Typography>
      <Stack direction="row" spacing={2} mt={4}>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button variant="outlined" onClick={() => navigate('/register')}>
          Register
        </Button>
      </Stack>
    </Box>
  );
};

export default StartPage;
