import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Chip,
    Stack,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.02)',
    },
}));

const CampingDashboard = () => {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch('http://10.11.10.13/api/equipment');
                const data = await response.json();
                if (data.success) {
                    setEquipment(data.data);
                }
            } catch (error) {
                console.error('Error fetching equipment:', error);
            }
        };
        fetchEquipment();
    }, []);

    const handleEquipmentClick = (equipmentId) => {
        navigate(`/equipment/${equipmentId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available':
                return 'success';
            case 'Reserved':
                return 'warning';
            case 'Rented':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 4 }}>
                    Camping Equipment Rental
                </Typography>
                <Box sx={{mb: 4}}>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/categories')}
                        sx={{ mr: 2 }}
                    >
                        Equipment Categories
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/my-rentals')}
                        sx={{ mr: 2 }}
                    >
                        My Rentals
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/guides')}
                    >
                        Camping Guides
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {equipment.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.EquipmentID}>
                            <StyledCard
                                onClick={() => handleEquipmentClick(item.EquipmentID)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.images[0] || 'https://placeholder.com/300x200'}
                                    alt={item.Name}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {item.Name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Brand: {item.Brand}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Status: <Chip 
                                            label={item.Status} 
                                            color={getStatusColor(item.Status)}
                                            size="small"
                                        />
                                    </Typography>
                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Box display="flex" alignItems="center">
                                            <PeopleIcon sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {item.Capacity || 'N/A'} Person
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <LocalOfferIcon sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {item.Category}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                                        ${item.DailyRate}/day
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Condition: {item.Condition}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {item.features?.map((feature, index) => (
                                            <Chip
                                                key={index}
                                                label={feature}
                                                size="small"
                                                sx={{ mr: 1, mb: 1 }}
                                            />
                                        )) || (
                                            <Typography variant="body2" color="text.secondary">
                                                {item.Description}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default CampingDashboard;