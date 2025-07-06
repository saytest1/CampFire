import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Box,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment data:', { paymentMethod, ...formData });
    // Xử lý thanh toán
    alert('Thanh toán thành công!');
    navigate('/my-rentals');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Thanh toán
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tổng tiền: 600,000đ
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Phương thức thanh toán</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel 
                value="credit_card" 
                control={<Radio />} 
                label="Thẻ tín dụng/Ghi nợ" 
              />
              <FormControlLabel 
                value="bank_transfer" 
                control={<Radio />} 
                label="Chuyển khoản ngân hàng" 
              />
              <FormControlLabel 
                value="cash" 
                control={<Radio />} 
                label="Tiền mặt khi nhận hàng" 
              />
            </RadioGroup>
          </FormControl>

          {paymentMethod === 'credit_card' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Số thẻ"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Tên trên thẻ"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Ngày hết hạn (MM/YY)"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          )}

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
              Xác nhận thanh toán
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentForm;