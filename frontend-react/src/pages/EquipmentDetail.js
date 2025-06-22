import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Chip,
    Button,
    ImageList,
    ImageListItem,
    Divider,
    Stack,
    Rating,
    TextField,
    Avatar,
    Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const EquipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEquipmentDetail = async () => {
            try {
                const response = await fetch(`http://10.11.10.13/api/equipment/${id}`);
                const data = await response.json();
                if (data.success) {
                    setEquipment(data.data);
                }
            } catch (error) {
                console.error('Error fetching equipment:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://10.11.10.13/api/equipment/${id}/reviews`);
                const data = await response.json();
                if (data.success) {
                    setReviews(data.data);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchEquipmentDetail();
        fetchReviews();
    }, [id]);

    const handleAddToCart = () => {
        const cartItem = {
            equipmentId: equipment.EquipmentID,
            name: equipment.Name,
            image: equipment.images[0],
            dailyRate: equipment.DailyRate,
            quantity: quantity
        };
        
        // Add to cart logic (localStorage or context)
        const existingCart = JSON.parse(localStorage.getItem('campingCart') || '[]');
        const existingItemIndex = existingCart.findIndex(item => item.equipmentId === equipment.EquipmentID);
        
        if (existingItemIndex >= 0) {
            existingCart[existingItemIndex].quantity += quantity;
        } else {
            existingCart.push(cartItem);
        }
        
        localStorage.setItem('campingCart', JSON.stringify(existingCart));
        alert('Added to cart successfully!');
    };

    const handleRentNow = () => {
        navigate(`/booking/${equipment.EquipmentID}`, { 
            state: { equipment, quantity } 
        });
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (!equipment) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>Equipment not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button 
                onClick={() => navigate('/')} 
                sx={{ mb: 2 }}
            >
                ← Back to Dashboard
            </Button>
            
            <Grid container spacing={4}>
                {/* Images Section */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <Box sx={{ p: 2 }}>
                            <img
                                src={equipment.images[selectedImage] || 'https://placeholder.com/400x300'}
                                alt={equipment.Name}
                                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </Box>
                        <ImageList sx={{ height: 100 }} cols={4} rowHeight={80}>
                            {equipment.images.map((image, index) => (
                                <ImageListItem 
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    sx={{ cursor: 'pointer', opacity: selectedImage === index ? 1 : 0.6 }}
                                >
                                    <img
                                        src={image}
                                        alt={`${equipment.Name} ${index + 1}`}
                                        loading="lazy"
                                        style={{ height: '80px', objectFit: 'cover' }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Card>
                </Grid>

                {/* Equipment Info Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {equipment.Name}
                    </Typography>
                    
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Chip 
                            label={equipment.Status} 
                            color={equipment.Status === 'Available' ? 'success' : 'error'}
                        />
                        <Chip label={equipment.Category} />
                        <Chip label={equipment.Brand} variant="outlined" />
                    </Stack>

                    <Typography variant="h5" color="primary.main" sx={{ mb: 2 }}>
                        ${equipment.DailyRate}/day
                    </Typography>

                    <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                        <Box display="flex" alignItems="center">
                            <PeopleIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">
                                Capacity: {equipment.Capacity || 'N/A'} person
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <LocalOfferIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">
                                Condition: {equipment.Condition}
                            </Typography>
                        </Box>
                    </Stack>

                    <Typography variant="body1" sx={{ mb: 3 }}>
                        {equipment.Description}
                    </Typography>

                    {/* Features */}
                    <Typography variant="h6" gutterBottom>
                        Features:
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                        {equipment.features?.map((feature, index) => (
                            <Stack key={index} direction="row" alignItems="center" sx={{ mb: 1 }}>
                                <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2">{feature}</Typography>
                            </Stack>
                        ))}
                    </Box>

                    {/* Quantity and Actions */}
                    <Divider sx={{ my: 3 }} />
                    
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="body1">Quantity:</Typography>
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            inputProps={{ min: 1, max: equipment.AvailableQuantity || 10 }}
                            size="small"
                            sx={{ width: 80 }}
                        />
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                            disabled={equipment.Status !== 'Available'}
                            fullWidth
                        >
                            Add to Cart
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CalendarTodayIcon />}
                            onClick={handleRentNow}
                            disabled={equipment.Status !== 'Available'}
                            fullWidth
                        >
                            Rent Now
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            {/* Reviews Section */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom>
                    Customer Reviews
                </Typography>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <Paper key={index} sx={{ p: 3, mb: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Avatar>{review.CustomerName?.charAt(0)}</Avatar>
                                <Box>
                                    <Typography variant="subtitle1">{review.CustomerName}</Typography>
                                    <Rating value={review.Rating} readOnly size="small" />
                                </Box>
                            </Stack>
                            <Typography variant="body1">{review.Comment}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(review.CreatedAt).toLocaleDateString()}
                            </Typography>
                        </Paper>
                    ))
                ) : (
                    <Typography color="text.secondary">No reviews yet.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default EquipmentDetail;