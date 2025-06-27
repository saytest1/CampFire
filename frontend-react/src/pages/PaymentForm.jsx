import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Box, Button,
    RadioGroup, Radio, FormControlLabel, FormControl,
    Select, MenuItem, Alert, Snackbar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const customerId = sessionStorage.getItem('customerId');
    
    const [booking, setBooking] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [selectedCard, setSelectedCard] = useState('');
    const [cards, setCards] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            // First fetch booking details
            const response = await fetch(`http://10.11.10.13/api/booking/${id}/details`);
            const data = await response.json();
            if (data.success) {
                setBooking(data.data);
                // Then calculate and update total amount
                await fetch(`http://10.11.10.13/api/booking/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Status: 'Confirmed',
                        PaymentStatus: 'Unpaid'
                    })
                });
                // Fetch updated booking with new total
                const updatedResponse = await fetch(`http://10.11.10.13/api/booking/${id}/details`);
                const updatedData = await updatedResponse.json();
                if (updatedData.success) {
                    setBooking(updatedData.data);
                }
            }
        };        

        const fetchCards = async () => {
            const response = await fetch(`http://10.11.10.13/api/paymentcard/customer/${customerId}`);
            const data = await response.json();
            if (data.success) {
                setCards(data.data);
            }
        };

        fetchBookingDetails();
        fetchCards();
    }, [id, customerId]);

    const handlePayment = async () => {
        try {
            // Create payment record
            const paymentResponse = await fetch('http://10.11.10.13/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    BookingID: id,
                    Amount: booking.TotalAmount,
                    PaymentMethod: paymentMethod,
                    TransactionNumber: selectedCard || Date.now().toString(),
                    PaymentDate: new Date().toISOString().split('T')[0]
                })
            });

            if (paymentResponse.ok) {
                // Update booking status
                await fetch(`http://10.11.10.13/api/booking/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Status: 'Completed',
                        PaymentStatus: 'Paid'
                    })
                });

                setShowSuccess(true);
                setTimeout(() => {
                    navigate('/bookings');
                }, 2000);
            }
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    if (!booking) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Payment for Booking #{id}
                </Typography>

                <Box sx={{ my: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Total Amount: ${booking.TotalAmount}
                    </Typography>

                    <FormControl fullWidth sx={{ my: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Payment Method
                        </Typography>
                        <RadioGroup
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
                            <FormControlLabel value="Credit Card" control={<Radio />} label="Credit Card" />
                        </RadioGroup>
                    </FormControl>

                    {paymentMethod === 'Credit Card' && (
                        <FormControl fullWidth sx={{ my: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Select Card
                            </Typography>
                            <Select
                                value={selectedCard}
                                onChange={(e) => setSelectedCard(e.target.value)}
                            >
                                {cards.map((card) => (
                                    <MenuItem key={card.CardID} value={card.CardID}>
                                        {card.BankName} - {card.EncryptedCardNumber}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={() => navigate('/bookings')}>
                            Cancel
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={handlePayment}
                            disabled={paymentMethod === 'Credit Card' && !selectedCard}
                        >
                            Confirm Payment
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Snackbar
                open={showSuccess}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Payment successful!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PaymentForm;
