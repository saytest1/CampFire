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
    Stack,
    Divider,
    Tab,
    Tabs,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Alert,
    LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RateReviewIcon from '@mui/icons-material/RateReview';

const MyRentals = () => {
    const navigate = useNavigate();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedRental, setSelectedRental] = useState(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            // Mock API call - replace with actual endpoint
            const response = await fetch('http://10.11.10.13/api/my-rentals', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setRentals(data.data);
            } else {
                // Mock data for demonstration
                setRentals(mockRentals);
            }
        } catch (error) {
            console.error('Error fetching rentals:', error);
            // Use mock data if API fails
            setRentals(mockRentals);
        } finally {
            setLoading(false);
        }
    };

    const mockRentals = [
        {
            id: 'R001',
            equipmentName: 'Coleman 4-Person Tent',
            equipmentBrand: 'Coleman',
            equipmentImage: 'https://placeholder.com/300x200',
            startDate: '2024-07-15',
            endDate: '2024-07-20',
            totalDays: 5,
            quantity: 1,
            dailyRate: 25,
            totalCost: 135,
            status: 'confirmed',
            bookingDate: '2024-07-01',
            deliveryOption: 'pickup',
            customerName: 'John Doe',
            customerPhone: '+1234567890'
        },
        {
            id: 'R002',
            equipmentName: 'Sleeping Bag - Arctic Pro',
            equipmentBrand: 'North Face',
            equipmentImage: 'https://placeholder.com/300x200',
            startDate: '2024-07-25',
            endDate: '2024-07-30',
            totalDays: 5,
            quantity: 2,
            dailyRate: 15,
            totalCost: 162,
            status: 'pending',
            bookingDate: '2024-07-10',
            deliveryOption: 'delivery',
            deliveryAddress: '123 Main St, City, State',
            customerName: 'John Doe',
            customerPhone: '+1234567890'
        },
        {
            id: 'R003',
            equipmentName: 'Portable Gas Stove',
            equipmentBrand: 'Jetboil',
            equipmentImage: 'https://placeholder.com/300x200',
            startDate: '2024-06-10',
            endDate: '2024-06-15',
            totalDays: 5,
            quantity: 1,
            dailyRate: 12,
            totalCost: 65,
            status: 'completed',
            bookingDate: '2024-06-01',
            deliveryOption: 'pickup',
            customerName: 'John Doe',
            customerPhone: '+1234567890'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'confirmed': return 'success';
            case 'completed': return 'primary';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <HourglassEmptyIcon />;
            case 'confirmed': return <CheckCircleIcon />;
            case 'completed': return <ReceiptIcon />;
            case 'cancelled': return <CancelIcon />;
            default: return <HourglassEmptyIcon />;
        }
    };

    const filterRentalsByStatus = () => {
        const statusMap = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];
        const currentStatus = statusMap[selectedTab];
        
        if (currentStatus === 'all') return rentals;
        return rentals.filter(rental => rental.status === currentStatus);
    };

    const handleViewDetails = (rental) => {
        setSelectedRental(rental);
        setOpenDetailDialog(true);
    };

    const handleCancelRental = (rental) => {
        setSelectedRental(rental);
        setOpenCancelDialog(true);
    };

    const confirmCancelRental = async () => {
        try {
            // API call to cancel rental
            const response = await fetch(`http://10.11.10.13/api/rentals/${selectedRental.id}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            
            if (response.ok) {
                // Update local state
                setRentals(prev => prev.map(rental => 
                    rental.id === selectedRental.id 
                        ? { ...rental, status: 'cancelled' }
                        : rental
                ));
                setOpenCancelDialog(false);
            }
        } catch (error) {
            console.error('Error cancelling rental:', error);
        }
    };

    const canCancelRental = (rental) => {
        const startDate = new Date(rental.startDate);
        const today = new Date();
        const daysDiff = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
        return rental.status === 'confirmed' && daysDiff > 2;
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <LinearProgress />
                <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading your rentals...</Typography>
            </Container>
        );
    }

    const filteredRentals = filterRentalsByStatus();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Rentals
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                    <Tab label="All Rentals" />
                    <Tab label="Pending" />
                    <Tab label="Confirmed" />
                    <Tab label="Completed" />
                    <Tab label="Cancelled" />
                </Tabs>
            </Box>

            {filteredRentals.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No rentals found
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                            You don't have any rentals in this category yet.
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => navigate('/dashboard')}
                        >
                            Browse Equipment
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {filteredRentals.map((rental) => (
                        <Grid item xs={12} md={6} key={rental.id}>
                            <Card>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                        <Typography variant="h6">
                                            {rental.equipmentName}
                                        </Typography>
                                        <Chip 
                                            icon={getStatusIcon(rental.status)}
                                            label={rental.status.toUpperCase()}
                                            color={getStatusColor(rental.status)}
                                            size="small"
                                        />
                                    </Stack>

                                    <Typography color="text.secondary" gutterBottom>
                                        {rental.equipmentBrand} • Booking #{rental.id}
                                    </Typography>

                                    <Box sx={{ my: 2 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                            <Typography variant="body2">
                                                {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">
                                            {rental.totalDays} days • Quantity: {rental.quantity}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Cost:
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            ${rental.totalCost}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewDetails(rental)}
                                            sx={{ flex: 1 }}
                                        >
                                            View Details
                                        </Button>
                                        
                                        {rental.status === 'completed' && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<RateReviewIcon />}
                                                onClick={() => navigate(`/review/${rental.id}`)}
                                            >
                                                Review
                                            </Button>
                                        )}
                                        
                                        {canCancelRental(rental) && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                onClick={() => handleCancelRental(rental)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Rental Details Dialog */}
            <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Rental Details</DialogTitle>
                <DialogContent>
                    {selectedRental && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <img 
                                    src={selectedRental.equipmentImage} 
                                    alt={selectedRental.equipmentName}
                                    style={{ width: '100%', borderRadius: 8 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h6" gutterBottom>
                                    {selectedRental.equipmentName}
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    {selectedRental.equipmentBrand}
                                </Typography>
                                
                                <List>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Booking ID" 
                                            secondary={selectedRental.id} 
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Rental Period" 
                                            secondary={`${new Date(selectedRental.startDate).toLocaleDateString()} - ${new Date(selectedRental.endDate).toLocaleDateString()}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Duration" 
                                            secondary={`${selectedRental.totalDays} days`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Quantity" 
                                            secondary={selectedRental.quantity}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Daily Rate" 
                                            secondary={`$${selectedRental.dailyRate}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Total Cost" 
                                            secondary={`$${selectedRental.totalCost}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Delivery Option" 
                                            secondary={selectedRental.deliveryOption === 'pickup' ? 'Store Pickup' : 'Delivery'}
                                        />
                                    </ListItem>
                                    {selectedRental.deliveryAddress && (
                                        <ListItem>
                                            <ListItemText 
                                                primary="Delivery Address" 
                                                secondary={selectedRental.deliveryAddress}
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
                <DialogTitle>Cancel Rental</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Are you sure you want to cancel this rental?
                    </Alert>
                    <Typography>
                        This action cannot be undone. Cancellation fees may apply depending on our policy.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCancelDialog(false)}>Keep Rental</Button>
                    <Button 
                        onClick={confirmCancelRental} 
                        color="error" 
                        variant="contained"
                    >
                        Cancel Rental
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyRentals;