import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Box, Button, 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookingList = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const customerId = sessionStorage.getItem('customerId');

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch(`http://10.11.10.13/api/booking/customer/${customerId}`);
            const data = await response.json();
            if (data.success) {
                setBookings(data.data);
            }
        };
        fetchBookings();
    }, [customerId]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">My Bookings</Typography>
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                    Back to Rooms
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Booking ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.BookingID}>
                                <TableCell>#{booking.BookingID}</TableCell>
                                <TableCell>{booking.BookingDate.substring(0, 10)}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={booking.Status}
                                        color={booking.Status === 'Confirmed' ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={booking.PaymentStatus}
                                        color={booking.PaymentStatus === 'Paid' ? 'success' : 'warning'}
                                    />
                                </TableCell>
                                <TableCell>${booking.TotalAmount}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        sx={{ mr: 1 }}
                                        onClick={() => navigate(`/booking/${booking.BookingID}`)}
                                    >
                                        View
                                    </Button>
                                    {booking.PaymentStatus === 'Unpaid' && (
                                        <Button 
                                            variant="contained" 
                                            size="small"
                                            onClick={() => navigate(`/booking/${booking.BookingID}/pay`)}
                                        >
                                            Pay
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default BookingList;
