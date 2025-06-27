import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8080/login', formData);
      
      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" color="primary" fontWeight="bold">
          CampReady Rentals
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Sign in to rent your camping essentials!
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Logging in…' : 'Login'}
          </Button>
          <Button fullWidth variant="text" onClick={() => navigate('/')}>
            ⬅ Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
