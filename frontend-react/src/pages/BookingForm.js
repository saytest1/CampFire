import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box, Container, Paper, Typography, TextField, Button, Grid, 
    IconButton, Divider, Stack, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const initialGuestForm = {
    FirstName: '',
    MiddleName: '',
    LastName: '',
    DateOfBirth: null,
    IDNumber: '',
    GuardianIDNumber: ''
};

const BookingForm = () => {
    const navigate = useNavigate();
    const customerId = sessionStorage.getItem('customerId');
    const { state } = useLocation();
    const { room } = state;
    
    const [guestForms, setGuestForms] = useState([{ ...initialGuestForm }]);
    const [existingBookings, setExistingBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState('new');

    useEffect(() => {
        const fetchExistingBookings = async () => {
            const response = await fetch(`http://10.11.10.13/api/booking/customer/${customerId}`);
            const result = await response.json();
            if (result.success) {
                const confirmedBookings = result.data.filter(booking => 
                    booking.Status === 'Confirmed' && booking.PaymentStatus === 'Unpaid'
                );
                setExistingBookings(confirmedBookings);
            }
        };
        fetchExistingBookings();
    }, [customerId]);

    const handleAddGuest = () => {
        if (guestForms.length < room.MaxOccupancy) {
            setGuestForms([...guestForms, { ...initialGuestForm }]);
        }
    };

    const handleRemoveGuest = (index) => {
        const newForms = guestForms.filter((_, i) => i !== index);
        setGuestForms(newForms);
    };

    const handleGuestChange = (index, field, value) => {
        const newForms = [...guestForms];
        newForms[index] = { ...newForms[index], [field]: value };
        setGuestForms(newForms);
    };

    const handleSubmit = async () => {
        try {
            let bookingId;
            
            if (selectedBooking === 'new') {
                // Create new booking
                const bookingResponse = await fetch('http://10.11.10.13/api/bookinginitial', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ CustomerID: customerId })
                });
                const bookingResult = await bookingResponse.json();
                bookingId = bookingResult.data.BookingID;
            } else {
                bookingId = selectedBooking;
            }

            // Create guests and booking details
            for (const guestForm of guestForms) {
                const guestResponse = await fetch('http://10.11.10.13/api/guests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        CustomerID: customerId,
                        ...guestForm
                    })
                });
                const guestResult = await guestResponse.json();
                
                await fetch(`http://10.11.10.13/api/booking/${bookingId}/detail`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        RoomID: room.RoomID,
                        GuestID: guestResult.data.GuestID
                    })
                });
            }

            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Book {room.TypeName} - Room {room.RoomNumber}
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Select Booking Option
                    </Typography>
                    <RadioGroup
                        value={selectedBooking}
                        onChange={(e) => setSelectedBooking(e.target.value)}
                    >
                        <FormControlLabel 
                            value="new" 
                            control={<Radio />} 
                            label="Create New Booking" 
                        />
                        {existingBookings.map(booking => (
                            <FormControlLabel
                                key={booking.BookingID}
                                value={booking.BookingID.toString()}
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography>
                                            Booking #{booking.BookingID} ({booking.BookingDate.substring(0, 10)})
                                        </Typography>
                                        {booking.guests && booking.guests.length > 0 && (
                                            <Box sx={{ ml: 2, mt: 1 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Existing Guests:
                                                </Typography>
                                                {booking.guests.map((guest, idx) => (
                                                    <Typography key={idx} variant="body2" color="text.secondary">
                                                        • {guest.FirstName} {guest.LastName}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                }
                            />
                        ))}
                    </RadioGroup>
                </Box>
                
                {guestForms.map((guestForm, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Typography variant="h6">Guest {index + 1}</Typography>
                            {index > 0 && (
                                <IconButton onClick={() => handleRemoveGuest(index)} color="error">
                                    <RemoveIcon />
                                </IconButton>
                            )}
                        </Stack>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={guestForm.FirstName}
                                    onChange={(e) => handleGuestChange(index, 'FirstName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Middle Name"
                                    value={guestForm.MiddleName}
                                    onChange={(e) => handleGuestChange(index, 'MiddleName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={guestForm.LastName}
                                    onChange={(e) => handleGuestChange(index, 'LastName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date of Birth"
                                    value={guestForm.DateOfBirth || ''}
                                    onChange={(e) => handleGuestChange(index, 'DateOfBirth', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="ID Number"
                                    value={guestForm.IDNumber}
                                    onChange={(e) => handleGuestChange(index, 'IDNumber', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Guardian ID Number"
                                    value={guestForm.GuardianIDNumber}
                                    onChange={(e) => handleGuestChange(index, 'GuardianIDNumber', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        {index < guestForms.length - 1 && <Divider sx={{ my: 3 }} />}
                    </Box>
                ))}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddGuest}
                        disabled={guestForms.length >= room.MaxOccupancy}
                    >
                        Add Guest
                    </Button>
                    <Box>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate(-1)} 
                            sx={{ mr: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Save Booking
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default BookingForm;
