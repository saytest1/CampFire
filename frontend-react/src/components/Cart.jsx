import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  Divider,
  Grid,
  TextField,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  
  // State giỏ hàng với dữ liệu mẫu
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      productId: 1,
      name: 'Lều cắm trại Coleman 4 người', 
      price: 250000, 
      quantity: 1, 
      startDate: '2025-07-10',
      endDate: '2025-07-12',
      days: 3,
      image: '/tent1.jpg'
    },
    { 
      id: 2, 
      productId: 3,
      name: 'Túi ngủ Naturehike', 
      price: 100000, 
      quantity: 2, 
      startDate: '2025-07-10',
      endDate: '2025-07-12',
      days: 3,
      image: '/sleeping1.jpg'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (itemId, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * item.quantity * item.days), 0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (subtotal * discount / 100);
  };

  const applyPromoCode = () => {
    // Giả lập mã giảm giá
    if (promoCode === 'SUMMER10') {
      setDiscount(10);
      alert('Áp dụng mã giảm giá 10% thành công!');
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    navigate('/checkout');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <ShoppingCartCheckoutIcon sx={{ mr: 2 }} />
        Giỏ hàng của bạn
      </Typography>
      
      {cartItems.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <RemoveShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/categories')}
          >
            Tiếp tục mua sắm
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Danh sách sản phẩm */}
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="center">Giá/ngày</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="center">Thời gian thuê</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                    <TableCell align="center">Xóa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img 
                            src={item.image} 
                            alt={item.name}
                            style={{ 
                              width: 60, 
                              height: 60, 
                              objectFit: 'cover',
                              marginRight: 16,
                              borderRadius: 4
                            }}
                          />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: #{item.productId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {item.price.toLocaleString('vi-VN')}đ
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 2, minWidth: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box>
                          <Typography variant="body2">
                            {new Date(item.startDate).toLocaleDateString('vi-VN')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            đến
                          </Typography>
                          <Typography variant="body2">
                            {new Date(item.endDate).toLocaleDateString('vi-VN')}
                          </Typography>
                          <Chip 
                            label={`${item.days} ngày`} 
                            size="small" 
                            color="primary"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {(item.price * item.quantity * item.days).toLocaleString('vi-VN')}đ
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="error"
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined"
                onClick={() => navigate('/products')}
              >
                Tiếp tục mua sắm
              </Button>
              <Button 
                variant="outlined"
                color="error"
                onClick={() => setCartItems([])}
              >
                Xóa tất cả
              </Button>
            </Box>
          </Grid>

          {/* Tổng kết đơn hàng */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tổng kết đơn hàng
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tạm tính:</Typography>
                    <Typography>{calculateSubtotal().toLocaleString('vi-VN')}đ</Typography>
                  </Box>
                  {discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="success.main">Giảm giá ({discount}%):</Typography>
                      <Typography color="success.main">
                        -{(calculateSubtotal() * discount / 100).toLocaleString('vi-VN')}đ
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6" color="primary">
                    {calculateTotal().toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>

                {/* Mã giảm giá */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Mã giảm giá
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Nhập mã"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      fullWidth
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={applyPromoCode}
                    >
                      Áp dụng
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Thử mã: SUMMER10 để giảm 10%
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCartCheckoutIcon />}
                  onClick={handleCheckout}
                >
                  Tiến hành thanh toán
                </Button>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Bằng việc thanh toán, bạn đồng ý với các điều khoản của chúng tôi
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;