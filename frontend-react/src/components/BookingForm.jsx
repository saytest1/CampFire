import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Box,
  Grid 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const { equipmentId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    quantity: 1,
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking data:', formData);
    // Xử lý đặt thuê và chuyển đến trang thanh toán
    navigate(`/payment/${equipmentId}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Đặt thuê thiết bị
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Ngày bắt đầu"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Ngày kết thúc"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Số lượng"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Ghi chú"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ flexGrow: 1 }}
            >
              Tiếp tục thanh toán
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingForm;