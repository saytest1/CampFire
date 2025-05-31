import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Box, Button, 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const BookingDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, detailId: null });

    useEffect(() => {
        const fetchBookingDetails = async () => {
            const response = await fetch(`http://10.11.10.13/api/booking/${id}/details`);
            const data = await response.json();
            if (data.success) {
                setBookingDetails(data.data);
            }
        };
        fetchBookingDetails();
    }, [id]);

    const handleDeleteDetail = async () => {
        const response = await fetch(`http://10.11.10.13/api/booking/detail/${deleteDialog.detailId}`, {
            method: 'DELETE'
        });
        
        if (response.status === 204) {
            setBookingDetails(details => 
                details.filter(detail => detail.BookingDetailID !== deleteDialog.detailId)
            );
        }
        setDeleteDialog({ open: false, detailId: null });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Booking #{id} Details</Typography>
                <Button variant="outlined" onClick={() => navigate('/bookings')}>
                    Back to Bookings
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Room Number</TableCell>
                            <TableCell>Room Type</TableCell>
                            <TableCell>Guest Name</TableCell>
                            <TableCell>ID Number</TableCell>
                            <TableCell>Base Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookingDetails.map((detail) => (
                            <TableRow key={detail.BookingDetailID}>
                                <TableCell>{detail.RoomNumber}</TableCell>
                                <TableCell>{detail.TypeName}</TableCell>
                                <TableCell>{`${detail.FirstName} ${detail.LastName}`}</TableCell>
                                <TableCell>{detail.IDNumber}</TableCell>
                                <TableCell>${detail.BasePrice}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        color="error"
                                        size="small"
                                        onClick={() => setDeleteDialog({ 
                                            open: true, 
                                            detailId: detail.BookingDetailID 
                                        })}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, detailId: null })}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this booking detail?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, detailId: null })}>Cancel</Button>
                    <Button onClick={handleDeleteDetail} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookingDetail;
