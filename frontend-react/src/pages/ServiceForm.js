import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Box, Button, TextField,
    MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const ServiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        ServiceName: '',
        ServiceType: '',
        Unit: '',
        UnitPrice: '',
        Description: ''
    });

    useEffect(() => {
        if (id) {
            const fetchService = async () => {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://10.11.10.13/api/service/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setFormData({
                        ServiceName: data.data.ServiceName,
                        ServiceType: data.data.ServiceType,
                        Unit: data.data.Unit,
                        UnitPrice: data.data.UnitPrice,
                        Description: data.data.Description
                    });
                }
            };
            fetchService();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://10.11.10.13/api/service${id ? `/${id}` : ''}`, {
            method: id ? 'PATCH' : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            navigate('/services');
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {id ? 'Edit Service' : 'New Service'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Service Name"
                        value={formData.ServiceName}
                        onChange={(e) => setFormData({...formData, ServiceName: e.target.value})}
                        required
                        sx={{ mb: 3 }}
                    />
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Service Type</InputLabel>
                        <Select
                            value={formData.ServiceType}
                            onChange={(e) => setFormData({...formData, ServiceType: e.target.value})}
                            required
                        >
                            <MenuItem value="Wellness">Wellness</MenuItem>
                            <MenuItem value="Laundry">Laundry</MenuItem>
                            <MenuItem value="Transportation">Transportation</MenuItem>
                            <MenuItem value="Recreation">Recreation</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Unit"
                        value={formData.Unit}
                        onChange={(e) => setFormData({...formData, Unit: e.target.value})}
                        required
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Unit Price"
                        value={formData.UnitPrice}
                        onChange={(e) => setFormData({...formData, UnitPrice: e.target.value})}
                        required
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={formData.Description}
                        onChange={(e) => setFormData({...formData, Description: e.target.value})}
                        sx={{ mb: 3 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={() => navigate('/services')}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            {id ? 'Update' : 'Create'} Service
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ServiceForm;
