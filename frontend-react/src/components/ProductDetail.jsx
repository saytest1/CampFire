import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Box,
  Tab,
  Tabs,
  Rating,
  Divider,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ImageList,
  ImageListItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import DateRangeIcon from '@mui/icons-material/DateRange';
import IconButton from '@mui/material/IconButton';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dữ liệu sản phẩm mẫu
  const product = {
    id: id,
    name: 'Lều cắm trại Coleman 4 người',
    price: 250000,
    rating: 4.5,
    reviews: 23,
    available: true,
    images: [
      '/tent-main.jpg',
      '/tent-inside.jpg',
      '/tent-setup.jpg',
      '/tent-packed.jpg'
    ],
    description: 'Lều cắm trại Coleman chất lượng cao, thiết kế rộng rãi cho 4 người. Chống thấm nước tuyệt đối, khung lều chắc chắn, dễ dàng lắp đặt.',
    features: [
      'Kích thước: 240 x 210 x 130 cm',
      'Trọng lượng: 4.5 kg',
      'Chất liệu: Polyester 190T chống thấm',
      'Khung: Hợp kim nhôm siêu nhẹ',
      'Thời gian lắp đặt: 10 phút',
      'Kèm bao đựng và phụ kiện'
    ],
    specifications: {
      'Thương hiệu': 'Coleman',
      'Model': 'Sundome 4',
      'Sức chứa': '4 người',
      'Mùa sử dụng': '3 mùa',
      'Chống nước': '2000mm',
      'Cửa sổ': '2 cửa với lưới chống côn trùng'
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const calculateTotalDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    return product.price * quantity * calculateTotalDays();
  };

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn ngày thuê!');
      return;
    }
    
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      startDate: startDate,
      endDate: endDate,
      totalDays: calculateTotalDays(),
      totalPrice: calculateTotalPrice()
    };
    
    console.log('Thêm vào giỏ:', cartItem);
    alert('Đã thêm vào giỏ hàng!');
    // Implement thêm vào giỏ hàng thực tế
  };

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn ngày thuê!');
      return;
    }
    navigate(`/booking/${product.id}?quantity=${quantity}&startDate=${startDate}&endDate=${endDate}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Hình ảnh sản phẩm */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0}>
            <Box sx={{ mb: 2 }}>
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Box>
            <ImageList cols={4} gap={8}>
              {product.images.map((image, index) => (
                <ImageListItem 
                  key={index}
                  sx={{ cursor: 'pointer', border: selectedImage === index ? '2px solid primary.main' : 'none' }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={{ height: '80px', objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>
        </Grid>

        {/* Thông tin sản phẩm */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {product.rating} ({product.reviews} đánh giá)
              </Typography>
            </Box>
            <Typography variant="h4" color="primary" gutterBottom>
              {product.price.toLocaleString('vi-VN')}đ / ngày
            </Typography>
            {product.available ? (
              <Chip label="Còn hàng" color="success" icon={<CheckCircleIcon />} />
            ) : (
              <Chip label="Hết hàng" color="error" />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Form đặt thuê */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: startDate || new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số lượng"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>
            </Grid>
            
            {startDate && endDate && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="body1">
                  Tổng: {calculateTotalDays()} ngày × {quantity} × {product.price.toLocaleString('vi-VN')}đ
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  = {calculateTotalPrice().toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
            )}
          </Box>

          {/* Nút hành động */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="contained" 
              size="large"
              fullWidth
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={!product.available}
            >
              Thêm vào giỏ
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              fullWidth
              startIcon={<DateRangeIcon />}
              onClick={handleBookNow}
              disabled={!product.available}
            >
              Đặt ngay
            </Button>
          </Box>

          {/* Cam kết */}
          <List dense>
            <ListItem>
              <ListItemIcon>
                <LocalShippingIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Giao hàng nhanh trong 24h" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Bảo hành thiết bị trong suốt thời gian thuê" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Kiểm tra chất lượng trước khi giao" />
            </ListItem>
          </List>

          {/* Chia sẻ */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs thông tin chi tiết */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Mô tả" />
          <Tab label="Thông số kỹ thuật" />
          <Tab label="Đánh giá" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Đặc điểm nổi bật:
              </Typography>
              <List>
                {product.features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Grid container spacing={2}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <Grid item xs={6} sm={4} key={key}>
                  <Typography variant="body2" color="text.secondary">
                    {key}:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
          
          {tabValue === 2 && (
            <Typography variant="body1">
              Chức năng đánh giá sẽ được cập nhật sau...
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;