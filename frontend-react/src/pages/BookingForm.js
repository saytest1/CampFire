import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Divider,
    Alert,
    Chip,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';

const BookingForm = () => {
    const { equipmentId } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        startDate: null,
        endDate: null,
        quantity: 1,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        specialRequests: '',
        deliveryOption: 'pickup',
        deliveryAddress: ''
    });
    const [errors, setErrors] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const [rentalDays, setRentalDays] = useState(0);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch(`http://10.11.10.13/api/equipment/${equipmentId}`);
                const data = await response.json();
                if (data.success) {
                    setEquipment(data.data);
                }
            } catch (error) {
                console.error('Error fetching equipment:', error);
            }
        };
        if (equipmentId) {
            fetchEquipment();
        }
    }, [equipmentId]);

    useEffect(() => {
        if (formData.startDate && formData.endDate && equipment) {
            const days = Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24));
            if (days > 0) {
                setRentalDays(days);
                const subtotal = days * formData.quantity * equipment.DailyRate;
                const deliveryFee = formData.deliveryOption === 'delivery' ? 25 : 0;
                setTotalCost(subtotal + deliveryFee);
            }
        }
    }, [formData.startDate, formData.endDate, formData.quantity, formData.deliveryOption, equipment]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
            newErrors.endDate = 'End date must be after start date';
        }
        if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
        if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
        if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
        if (formData.deliveryOption === 'delivery' && !formData.deliveryAddress.trim()) {
            newErrors.deliveryAddress = 'Delivery address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            const bookingData = {
                equipmentId: equipment.EquipmentID,
                ...formData,
                totalCost,
                rentalDays,
                status: 'pending'
            };

            const response = await fetch('http://10.11.10.13/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();
            if (result.success) {
                navigate('/payment', { state: { bookingId: result.bookingId, bookingData } });
            } else {
                setErrors({ submit: 'Failed to create booking. Please try again.' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!equipment) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography>Loading equipment details...</Typography>
            </Container>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Book Equipment
                </Typography>

                <Grid container spacing={4}>
                    {/* Equipment Summary */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Equipment Summary
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <img 
                                        src={equipment.images?.[0] || 'https://placeholder.com/200x150'} 
                                        alt={equipment.Name}
                                        style={{ width: '100%', borderRadius: 8 }}
                                    />
                                </Box>
                                <Typography variant="h6">{equipment.Name}</Typography>
                                <Typography color="text.secondary">{equipment.Brand}</Typography>
                                <Chip 
                                    label={equipment.Category} 
                                    size="small" 
                                    sx={{ mt: 1 }}
                                />
                                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                    ${equipment.DailyRate}/day
                                </Typography>
                                
                                {rentalDays > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Cost Breakdown
                                        </Typography>
                                        <List dense>
                                            <ListItem>
                                                <ListItemText 
                                                    primary={`${rentalDays} days × ${formData.quantity} items`}
                                                    secondary={`$${equipment.DailyRate} per day`}
                                                />
                                                <Typography>${rentalDays * formData.quantity * equipment.DailyRate}</Typography>
                                            </ListItem>
                                            {formData.deliveryOption === 'delivery' && (
                                                <ListItem>
                                                    <ListItemText primary="Delivery Fee" />
                                                    <Typography>$25</Typography>
                                                </ListItem>
                                            )}
                                            <Divider />
                                            <ListItem>
                                                <ListItemText 
                                                    primary="Total"
                                                    primaryTypographyProps={{ variant: 'h6' }}
                                                />
                                                <Typography variant="h6" color="primary">
                                                    ${totalCost}
                                                </Typography>
                                            </ListItem>
                                        </List>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Booking Form */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <Typography variant="h6" gutterBottom>
                                        Rental Details
                                    </Typography>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <DatePicker
                                                label="Start Date"
                                                value={formData.startDate}
                                                onChange={(date) => handleInputChange('startDate', date)}
                                                renderInput={(params) => (
                                                    <TextField 
                                                        {...params} 
                                                        fullWidth
                                                        error={!!errors.startDate}
                                                        helperText={errors.startDate}
                                                    />
                                                )}
                                                minDate={new Date()}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <DatePicker
                                                label="End Date"
                                                value={formData.endDate}
                                                onChange={(date) => handleInputChange('endDate', date)}
                                                renderInput={(params) => (
                                                    <TextField 
                                                        {...params} 
                                                        fullWidth
                                                        error={!!errors.endDate}
                                                        helperText={errors.endDate}
                                                    />
                                                )}
                                                minDate={formData.startDate || new Date()}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Quantity"
                                                type="number"
                                                value={formData.quantity}
                                                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                                                fullWidth
                                                inputProps={{ min: 1, max: 10 }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                                        Contact Information
                                    </Typography>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Full Name"
                                                value={formData.customerName}
                                                onChange={(e) => handleInputChange('customerName', e.target.value)}
                                                fullWidth
                                                required
                                                error={!!errors.customerName}
                                                helperText={errors.customerName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Email"
                                                type="email"
                                                value={formData.customerEmail}
                                                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                                fullWidth
                                                required
                                                error={!!errors.customerEmail}
                                                helperText={errors.customerEmail}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Phone Number"
                                                value={formData.customerPhone}
                                                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                                fullWidth
                                                required
                                                error={!!errors.customerPhone}
                                                helperText={errors.customerPhone}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Delivery Option</InputLabel>
                                                <Select
                                                    value={formData.deliveryOption}
                                                    onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                                                    label="Delivery Option"
                                                >
                                                    <MenuItem value="pickup">Store Pickup (Free)</MenuItem>
                                                    <MenuItem value="delivery">Delivery (+$25)</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {formData.deliveryOption === 'delivery' && (
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Delivery Address"
                                                    value={formData.deliveryAddress}
                                                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    required
                                                    error={!!errors.deliveryAddress}
                                                    helperText={errors.deliveryAddress}
                                                />
                                            </Grid>
                                        )}
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Special Requests (Optional)"
                                                value={formData.specialRequests}
                                                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                                fullWidth
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                    </Grid>

                                    {errors.submit && (
                                        <Alert severity="error" sx={{ mt: 3 }}>
                                            {errors.submit}
                                        </Alert>
                                    )}

                                    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(-1)}
                                            sx={{ flex: 1 }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            loading={loading}
                                            startIcon={<PaymentIcon />}
                                            sx={{ flex: 1 }}
                                            disabled={loading}
                                        >
                                            Proceed to Payment
                                        </Button>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </LocalizationProvider>
    );
};

export default BookingForm;