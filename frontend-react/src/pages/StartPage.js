import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'background.default',
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          The Conjuring
        </Typography>
        <Typography variant="h4" sx={{ mb: 4, color: 'text.secondary' }}>
          Where Luxury Meets Mystery
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default StartPage;
