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
  Rating,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from '../graphql/products';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products from GraphQL API
  const { loading, error, data } = useQuery(
    categoryId ? GET_PRODUCTS_BY_CATEGORY : GET_ALL_PRODUCTS,
    {
      variables: categoryId 
        ? { categoryId, first: 22, offset: 0 }
        : { first: 22, offset: 0 },
      fetchPolicy: 'cache-and-network'
    }
  );

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    if (!data?.products?.nodes) return [];
    
    let products = data.products.nodes;
    
    // Filter by search term
    if (searchTerm) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort products
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'category':
          return (a.categoryName || '').localeCompare(b.categoryName || '');
        default:
          return 0;
      }
    });
  };

  const sortedProducts = getFilteredAndSortedProducts();

  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    // Thêm vào giỏ hàng - sẽ implement sau
    console.log('Thêm vào giỏ:', product);
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang tải sản phẩm...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Lỗi khi tải sản phẩm: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
        {categoryId && data?.products?.nodes?.length > 0 && (
          <Typography variant="subtitle1" color="text.secondary">
            Danh mục: {data.products.nodes[0].categoryName}
          </Typography>
        )}
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
            <MenuItem value="category">Danh mục</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Danh sách sản phẩm */}
      <Grid container spacing={3}>
        {sortedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
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
                image={product.imageUrl || '/placeholder-product.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => handleViewDetail(product._id)}
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
                  onClick={() => handleViewDetail(product._id)}
                >
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.manufacturerName && `Thương hiệu: ${product.manufacturerName}`}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    label={product.categoryName || 'Không phân loại'} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary">
                    {product.price?.toLocaleString('vi-VN')}đ/ngày
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetail(product._id)}
                >
                  Chi tiết
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
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
            {searchTerm 
              ? `Không tìm thấy sản phẩm nào phù hợp với "${searchTerm}"`
              : 'Không có sản phẩm nào trong danh mục này'
            }
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Products;