import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  CardActions,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Rating
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  // Dữ liệu sản phẩm mẫu
  const products = [
    {
      id: 1,
      name: 'Lều cắm trại Coleman 4 người',
      category: 1,
      price: 250000,
      image: '/tent1.jpg',
      rating: 4.5,
      reviews: 23,
      available: true,
      description: 'Lều cao cấp chống thấm, dễ dựng'
    },
    {
      id: 2,
      name: 'Lều 2 người siêu nhẹ',
      category: 1,
      price: 150000,
      image: '/tent2.jpg',
      rating: 4.0,
      reviews: 15,
      available: true,
      description: 'Lều compact cho backpacker'
    },
    {
      id: 3,
      name: 'Túi ngủ Naturehike',
      category: 2,
      price: 100000,
      image: '/sleeping1.jpg',
      rating: 4.8,
      reviews: 45,
      available: true,
      description: 'Túi ngủ ấm, nhẹ, gọn'
    },
    {
      id: 4,
      name: 'Bếp gas mini Campingmoon',
      category: 3,
      price: 80000,
      image: '/stove1.jpg',
      rating: 4.6,
      reviews: 32,
      available: false,
      description: 'Bếp gas tiết kiệm, an toàn'
    },
    {
      id: 5,
      name: 'Đèn pin LED siêu sáng',
      category: 4,
      price: 50000,
      image: '/flashlight1.jpg',
      rating: 4.3,
      reviews: 18,
      available: true,
      description: 'Đèn pin chống nước, pin lâu'
    },
    {
      id: 6,
      name: 'Bộ nồi cắm trại inox',
      category: 5,
      price: 120000,
      image: '/cookset1.jpg',
      rating: 4.7,
      reviews: 28,
      available: true,
      description: 'Bộ nồi gọn nhẹ, đa năng'
    }
  ];

  // Lọc sản phẩm theo category và search term
  const filteredProducts = products.filter(product => {
    const matchCategory = !categoryId || product.category === parseInt(categoryId);
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    // Thêm vào giỏ hàng - sẽ implement sau
    console.log('Thêm vào giỏ:', product);
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
      </Typography>
      
      {/* Thanh tìm kiếm và sắp xếp */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={sortBy}
            label="Sắp xếp theo"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="name">Tên A-Z</MenuItem>
            <MenuItem value="priceLow">Giá thấp đến cao</MenuItem>
            <MenuItem value="priceHigh">Giá cao đến thấp</MenuItem>
            <MenuItem value="rating">Đánh giá</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Danh sách sản phẩm */}
      <Grid container spacing={3}>
        {sortedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => handleViewDetail(product.id)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  component="div"
                  sx={{ 
                    minHeight: '3em',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' }
                  }}
                  onClick={() => handleViewDetail(product.id)}
                >
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={product.rating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.reviews})
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary">
                    {product.price.toLocaleString('vi-VN')}đ/ngày
                  </Typography>
                  {!product.available && (
                    <Chip label="Hết hàng" color="error" size="small" />
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetail(product.id)}
                >
                  Chi tiết
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  disabled={!product.available}
                  onClick={() => handleAddToCart(product)}
                >
                  Thêm vào giỏ
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {sortedProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy sản phẩm nào
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Products;