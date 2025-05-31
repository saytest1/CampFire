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
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PersonIcon from '@mui/icons-material/Person';
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

const Dashboard = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetch('http://10.11.10.13/api/room');
            const data = await response.json();
            if (data.success) {
                setRooms(data.data);
            }
        };
        fetchRooms();
    }, []);

    const handleRoomClick = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 4 }}>
                    Hotel Room Dashboard
                </Typography>
                <Box sx={{mb: 4}}>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/services')}
                        sx={{ mr: 2 }}
                    >
                        Services
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/bookings')}
                    >
                        View My Bookings
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {rooms.map((room) => (
                        <Grid item xs={12} sm={6} md={4} key={room.RoomID}>
                            <StyledCard
                                onClick={() => handleRoomClick(room.RoomID)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={room.images[2] || 'https://placeholder.com/300x200'}
                                    alt={room.TypeName}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {room.TypeName} - Room {room.RoomNumber}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Status: <Chip 
                                            label={room.Status} 
                                            color={room.Status === 'Available' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </Typography>
                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Box display="flex" alignItems="center">
                                            <PersonIcon sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {room.MaxOccupancy} Guests
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <SquareFootIcon sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {room.Area} m²
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                                        ${room.BasePrice}/night
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {room.amenities.map((amenity, index) => (
                                            <Chip
                                                key={index}
                                                label={amenity}
                                                size="small"
                                                sx={{ mr: 1, mb: 1 }}
                                            />
                                        ))}
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

export default Dashboard;
