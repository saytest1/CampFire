import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Button, Card, Grid, Chip,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';

const ServiceList = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://10.11.10.13/api/service', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setServices(data.data);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Decode JWT token to get role
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
    }, []);

    const getServiceIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'wellness':
                return <SpaIcon />;
            case 'laundry':
                return <LocalLaundryServiceIcon />;
            case 'transportation':
                return <AirportShuttleIcon />;
            case 'recreation':
            case 'bike rentals':
                return <DirectionsBikeIcon />;
            default:
                return <RoomServiceIcon />;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Hotel Services
                </Typography>
                <Box>
                    {(userRole === 'admin' || userRole === 'manager') && (
                        <Button 
                            variant="contained" 
                            onClick={() => navigate('/services/new')}
                            sx={{ mr: 2 }}
                        >
                            Add New Service
                        </Button>
                    )}
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Rooms
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={7} sx={{mb: 4}}>
                {services.map((service) => (
                    <Grid item xs={12} md={6} key={service.ServiceID}>
                        <Card 
                            elevation={3} 
                            sx={{ 
                                p: 3,
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ mr: 2, color: 'primary.main' }}>
                                    {getServiceIcon(service.ServiceType)}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {service.ServiceName}
                                </Typography>
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ mb: 2 }}>
                                <Chip 
                                    label={service.ServiceType}
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Chip 
                                    label={`${service.Unit}`}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {service.Description}
                            </Typography>
                            
                            <Typography 
                                variant="h6" 
                                color="primary.main"
                                sx={{ fontWeight: 'bold' }}
                            >
                                ${service.UnitPrice} per {service.Unit}
                            </Typography>

                            {(userRole === 'admin' || userRole === 'manager') && (
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    <Button 
                                        size="small" 
                                        variant="outlined"
                                        onClick={() => navigate(`/services/edit/${service.ServiceID}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        color="error"
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this service?')) {
                                                const token = localStorage.getItem('token');
                                                await fetch(`http://10.11.10.13/api/service/${service.ServiceID}`, {
                                                    method: 'DELETE',
                                                    headers: { 'Authorization': `Bearer ${token}` }
                                                });
                                                setServices(services.filter(s => s.ServiceID !== service.ServiceID));
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ServiceList;
