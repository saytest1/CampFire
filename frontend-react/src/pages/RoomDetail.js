import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    ImageList,
    ImageListItem,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Chip,
} from '@mui/material';
import {
    KingBed,
    People,
    SquareFoot,
    AttachMoney,
    CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RoomDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const fetchRoomDetail = async () => {
            const response = await fetch(`http://10.11.10.13/api/room/${id}`);
            const data = await response.json();
            if (data.success) {
                setRoom(data.data);
            }
        };
        fetchRoomDetail();
    }, [id]);

    if (!room) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>
                            {room.TypeName} - Room {room.RoomNumber}
                        </Typography>
                        <Chip 
                            label={room.Status}
                            color={room.Status === 'Available' ? 'success' : 'error'}
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ImageList sx={{ height: 450 }} cols={3} rowHeight={200}>
                            {room.images.map((image, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={image}
                                        alt={`Room view ${index + 1}`}
                                        loading="lazy"
                                        style={{ height: '100%', objectFit: 'cover' }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Room Features
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <KingBed />
                                </ListItemIcon>
                                <ListItemText primary={room.TypeName} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <People />
                                </ListItemIcon>
                                <ListItemText primary={`Maximum ${room.MaxOccupancy} Guests`} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <SquareFoot />
                                </ListItemIcon>
                                <ListItemText primary={`${room.Area} Square Meters`} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AttachMoney />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={`$${room.BasePrice} per night`}
                                    secondary="Taxes and fees not included"
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Amenities
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {room.amenities.map((amenity, index) => (
                                <Chip
                                    key={index}
                                    icon={<CheckCircle />}
                                    label={amenity}
                                    variant="outlined"
                                    color="primary"
                                />
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button 
                                variant="contained" 
                                size="large"
                                disabled={room.Status !== 'Available'}
                                onClick={() => navigate(`/booking/new/${room.RoomID}`, { state: { room } })}
                            >
                                Book Now
                            </Button>
                            <Button variant="outlined" size="large" onClick={() => navigate('/dashboard')}>
                                Back to Rooms
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default RoomDetail;
