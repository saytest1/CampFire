import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    IconButton,
    TextField,
    Stack,
    Divider,
    Alert,
    Chip,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [rentalDates, setRentalDates] = useState({
        startDate: null,
        endDate: null
    });
    const [rentalDays, setRentalDays] = useState(1);
    const [openDateDialog, setOpenDateDialog] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        loadCartItems();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [cartItems, rentalDays]);

    const loadCartItems = () => {
        const savedCart = JSON.parse(localStorage.getItem('campingCart') || '[]');
        setCartItems(savedCart);
    };

    const saveCartItems = (items) => {
        setCartItems(items);
        localStorage.setItem('campingCart', JSON.stringify(items));
    };

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.DailyRate * item.quantity * rentalDays);
        }, 0);
        setTotalCost(subtotal);
    };

    const updateQuantity = (equipmentId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedItems = cartItems.map(item => 
            item.EquipmentID === equipmentId 
                ? { ...item, quantity: newQuantity }
                : item
        );
        saveCartItems(updatedItems);
    };

    const removeItem = (equipmentId) => {
        const updatedItems = cartItems.filter(item => item.EquipmentID !== equipmentId);
        saveCartItems(updatedItems);
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('campingCart');
    };

    const handleSetRentalDates = (item) => {
        setSelectedItemId(item.EquipmentID);
        setOpenDateDialog(true);
    };

    const handleDateConfirm = () => {
        if (rentalDates.startDate && rentalDates.endDate) {
            const days = Math.ceil((rentalDates.endDate - rentalDates.startDate) / (1000 * 60 * 60 * 24));
            if (days > 0) {
                setRentalDays(days);
                const updatedItems = cartItems.map(item => 
                    item.EquipmentID === selectedItemId 
                        ? { ...item, startDate: rentalDates.startDate, endDate: rentalDates.endDate, rentalDays: days }
                        : item
                );
                saveCartItems(updatedItems);
            }
        }
        setOpenDateDialog(false);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        
        // Check if all items have rental dates
        const itemsWithoutDates = cartItems.filter(item => !item.startDate || !item.endDate);
        if (itemsWithoutDates.length > 0) {
            alert('Please set rental dates for all items before checkout.');
            return;
        }

        // Navigate to checkout with cart data
        navigate('/checkout', { state: { cartItems, totalCost } });
    };

    if (cartItems.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Your cart is empty
                </Typography>
                <Typography color="text.secondary" paragraph>
                    Add some camping equipment to get started!
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/dashboard')}
                    sx={{ mt: 2 }}
                >
                    Browse Equipment
                </Button>
            </Container>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Shopping Cart
                </Typography>

                <Grid container spacing={4}>
                    {/* Cart Items */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={2}>
                            {cartItems.map((item) => (
                                <Card key={item.EquipmentID}>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={3}>
                                                <CardMedia
                                                    component="img"
                                                    height="120"
                                                    image={item.images?.[0] || 'https://placeholder.com/200x120'}
                                                    alt={item.Name}
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" gutterBottom>
                                                    {item.Name}
                                                </Typography>
                                                <Typography color="text.secondary" gutterBottom>
                                                    {item.Brand} • {item.Category}
                                                </Typography>
                                                <Chip 
                                                    label={item.Status} 
                                                    color="success" 
                                                    size="small"
                                                    sx={{ mb: 1 }}
                                                />
                                                <Typography variant="body2" color="primary">
                                                    ${item.DailyRate}/day
                                                </Typography>
                                                
                                                {/* Rental Dates */}
                                                <Box sx={{ mt: 2 }}>
                                                    {item.startDate && item.endDate ? (
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Rental: {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                ({item.rentalDays} days)
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            startIcon={<CalendarTodayIcon />}
                                                            onClick={() => handleSetRentalDates(item)}
                                                            color="primary"
                                                        >
                                                            Set Rental Dates
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Stack spacing={2} alignItems="center">
                                                    {/* Quantity Controls */}
                                                    <Box display="flex" alignItems="center">
                                                        <IconButton 
                                                            onClick={() => updateQuantity(item.EquipmentID, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <TextField
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.EquipmentID, parseInt(e.target.value) || 1)}
                                                            size="small"
                                                            sx={{ width: 60, mx: 1 }}
                                                            inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                                        />
                                                        <IconButton 
                                                            onClick={() => updateQuantity(item.EquipmentID, item.quantity + 1)}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Box>
                                                    
                                                    {/* Item Total */}
                                                    <Typography variant="h6" color="primary">
                                                        ${(item.DailyRate * item.quantity * (item.rentalDays || 1)).toFixed(2)}
                                                    </Typography>
                                                    
                                                    {/* Remove Button */}
                                                    <IconButton 
                                                        onClick={() => removeItem(item.EquipmentID)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                                variant="outlined" 
                                color="error"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </Button>
                            <Button 
                                variant="text"
                                onClick={() => navigate('/dashboard')}
                            >
                                Continue Shopping
                            </Button>
                        </Box>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Order Summary
                                </Typography>
                                
                                <List>
                                    {cartItems.map((item) => (
                                        <ListItem key={item.EquipmentID} sx={{ px: 0 }}>
                                            <ListItemText 
                                                primary={`${item.Name} × ${item.quantity}`}
                                                secondary={`${item.rentalDays || 1} days`}
                                            />
                                            <Typography>
                                                ${(item.DailyRate * item.quantity * (item.rentalDays || 1)).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                                    <Typography>Subtotal:</Typography>
                                    <Typography>${totalCost.toFixed(2)}</Typography>
                                </Box>
                                
                                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                                    <Typography>Tax (8%):</Typography>
                                    <Typography>${(totalCost * 0.08).toFixed(2)}</Typography>
                                </Box>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h6" color="primary">
                                        ${(totalCost * 1.08).toFixed(2)}
                                    </Typography>
                                </Box>

                                {/* Check if all items have dates */}
                                {cartItems.some(item => !item.startDate || !item.endDate) && (
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        Please set rental dates for all items before checkout.
                                    </Alert>
                                )}
                                
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    startIcon={<PaymentIcon />}
                                    onClick={handleCheckout}
                                    disabled={cartItems.some(item => !item.startDate || !item.endDate)}
                                >
                                    Proceed to Checkout
                                </Button>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                    Secure checkout with SSL encryption
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Date Selection Dialog */}
                <Dialog open={openDateDialog} onClose={() => setOpenDateDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Set Rental Dates</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Start Date"
                                    value={rentalDates.startDate}
                                    onChange={(date) => setRentalDates(prev => ({ ...prev, startDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    minDate={new Date()}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="End Date"
                                    value={rentalDates.endDate}
                                    onChange={(date) => setRentalDates(prev => ({ ...prev, endDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    minDate={rentalDates.startDate || new Date()}
                                />
                            </Grid>
                        </Grid>
                        
                        {rentalDates.startDate && rentalDates.endDate && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Rental period: {Math.ceil((rentalDates.endDate - rentalDates.startDate) / (1000 * 60 * 60 * 24))} days
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDateDialog(false)}>Cancel</Button>
                        <Button 
                            onClick={handleDateConfirm} 
                            variant="contained"
                            disabled={!rentalDates.startDate || !rentalDates.endDate}
                        >
                            Confirm Dates
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </LocalizationProvider>
    );
};

export default Cart;