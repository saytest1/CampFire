import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Username: '',
    Phone: '',
    Password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://10.11.10.13/api/register', formData);
      if (response.data.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 3,
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          CampReady Rentals
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create your account to start renting camping gear!
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Username"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="Password"
            type="password"
            value={formData.Password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/')}
          >
            ⬅ Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
