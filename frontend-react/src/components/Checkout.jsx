import React, { useState } from 'react';
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Checkout = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    city: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const steps = ['Thông tin giao hàng', 'Phương thức thanh toán', 'Xác nhận đơn hàng'];

  // Dữ liệu giỏ hàng mẫu
  const cartItems = [
    { 
      name: 'Lều cắm trại Coleman 4 người', 
      price: 250000, 
      quantity: 1, 
      days: 3
    },
    { 
      name: 'Túi ngủ Naturehike', 
      price: 100000, 
      quantity: 2, 
      days: 3
    }
  ];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * item.quantity * item.days), 0
    );
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = () => {
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản và điều kiện!');
      return;
    }
    
    // Xử lý đặt hàng
    console.log('Đặt hàng:', { shippingInfo, paymentMethod, cartItems });
    alert('Đặt hàng thành công!');
    navigate('/order-history');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Thông tin người nhận
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Quận/Huyện"
                  name="district"
                  value={shippingInfo.district}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Tỉnh/Thành phố"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Ghi chú"
                  name="notes"
                  value={shippingInfo.notes}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Chọn phương thức thanh toán
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Paper sx={{ p: 2, mb: 2 }}>
                  <FormControlLabel 
                    value="cod" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="subtitle1">
                          Thanh toán khi nhận hàng (COD)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thanh toán bằng tiền mặt khi nhận thiết bị
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <FormControlLabel 
                    value="transfer" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="subtitle1">
                          Chuyển khoản ngân hàng
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Chuyển khoản trước khi nhận hàng
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
                <Paper sx={{ p: 2 }}>
                  <FormControlLabel 
                    value="card" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="subtitle1">
                          Thẻ tín dụng/Ghi nợ
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thanh toán online bằng thẻ Visa, Mastercard
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Xác nhận thông tin đơn hàng
            </Typography>
            
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Thông tin giao hàng
              </Typography>
              <Typography variant="body2">
                {shippingInfo.fullName} - {shippingInfo.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shippingInfo.address}, {shippingInfo.district}, {shippingInfo.city}
              </Typography>
              {shippingInfo.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Ghi chú: {shippingInfo.notes}
                </Typography>
              )}
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Phương thức thanh toán
              </Typography>
              <Typography variant="body2">
                {paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                {paymentMethod === 'transfer' && 'Chuyển khoản ngân hàng'}
                {paymentMethod === 'card' && 'Thẻ tín dụng/Ghi nợ'}
              </Typography>
            </Paper>

            <FormControlLabel
              control={
                <Checkbox 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
              }
              label="Tôi đồng ý với điều khoản và điều kiện của CampFire"
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Thanh toán
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Form bên trái */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Quay lại
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handlePlaceOrder}
                  startIcon={<CheckCircleIcon />}
                >
                  Đặt hàng
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Tiếp tục
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Tóm tắt đơn hàng bên phải */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tóm tắt đơn hàng
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              {cartItems.map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.quantity} x ${item.days} ngày`}
                  />
                  <Typography variant="body2">
                    {(item.price * item.quantity * item.days).toLocaleString('vi-VN')}đ
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tạm tính:</Typography>
              <Typography>{calculateTotal().toLocaleString('vi-VN')}đ</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Phí vận chuyển:</Typography>
              <Typography color="success.main">Miễn phí</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Tổng cộng:</Typography>
              <Typography variant="h6" color="primary">
                {calculateTotal().toLocaleString('vi-VN')}đ
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Đặt cọc 30% khi nhận hàng
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;