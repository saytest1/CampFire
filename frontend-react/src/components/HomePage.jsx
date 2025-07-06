import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Paper,
  Chip,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CampingIcon from '@mui/icons-material/NaturePeople';
import ExploreIcon from '@mui/icons-material/Explore';

const HomePage = () => {
  const navigate = useNavigate();

  // Dữ liệu mẫu
  const featuredProducts = [
    {
      id: 1,
      name: 'Lều cắm trại Coleman 4 người',
      price: 250000,
      image: '/tent1.jpg',
      rating: 4.5,
      discount: 10
    },
    {
      id: 2,
      name: 'Túi ngủ Naturehike siêu nhẹ',
      price: 100000,
      image: '/sleeping1.jpg',
      rating: 4.8,
      discount: 15
    },
    {
      id: 3,
      name: 'Bếp gas mini Campingmoon',
      price: 80000,
      image: '/stove1.jpg',
      rating: 4.6,
      discount: 0
    },
    {
      id: 4,
      name: 'Bộ nồi cắm trại inox 8 món',
      price: 120000,
      image: '/cookset1.jpg',
      rating: 4.7,
      discount: 20
    }
  ];

  const statistics = [
    { title: 'Sản phẩm', value: '150+', icon: <InventoryIcon />, color: '#4CAF50' },
    { title: 'Khách hàng', value: '1,200+', icon: <GroupIcon />, color: '#2196F3' },
    { title: 'Đơn thuê', value: '3,500+', icon: <TrendingUpIcon />, color: '#FF5722' },
    { title: 'Đánh giá 5★', value: '98%', icon: <StarIcon />, color: '#FFC107' }
  ];

  const topRentals = [
    { name: 'Lều cắm trại 2-3 người', count: 125, avatar: '/tent-icon.jpg' },
    { name: 'Túi ngủ mùa đông', count: 98, avatar: '/sleeping-icon.jpg' },
    { name: 'Bếp gas du lịch', count: 87, avatar: '/stove-icon.jpg' },
    { name: 'Đèn camping LED', count: 76, avatar: '/light-icon.jpg' },
    { name: 'Ghế xếp du lịch', count: 65, avatar: '/chair-icon.jpg' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Chào mừng đến với CampFire
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Nơi bạn có thể thuê và mua các thiết bị cắm trại chất lượng
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/categories')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
              startIcon={<ExploreIcon />}
            >
              Khám phá ngay
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Xem tất cả sản phẩm
            </Button>
          </Box>
        </Box>
        <CampingIcon
          sx={{
            position: 'absolute',
            right: -50,
            bottom: -50,
            fontSize: 300,
            opacity: 0.1
          }}
        />
      </Paper>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statistics.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card
              sx={{
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    width: 56,
                    height: 56,
                    margin: '0 auto 16px'
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Featured Products */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Sản phẩm nổi bật
          </Typography>
          <Button onClick={() => navigate('/products')}>
            Xem tất cả →
          </Button>
        </Box>
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  {product.discount > 0 && (
                    <Chip
                      label={`-${product.discount}%`}
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10
                      }}
                    />
                  )}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h6" sx={{ minHeight: '3em' }}>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} readOnly size="small" precision={0.5} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {product.discount > 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {product.price.toLocaleString('vi-VN')}đ
                      </Typography>
                    )}
                    <Typography variant="h6" color="primary">
                      {(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Two columns section */}
      <Grid container spacing={3}>
        {/* Top Rentals */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Top sản phẩm được thuê nhiều
            </Typography>
            <List>
              {topRentals.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      py: 2,
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate('/products')}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `primary.${index % 2 ? 'light' : 'main'}` }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.count} lượt thuê trong tháng`}
                    />
                    <Chip
                      label="Hot"
                      color="error"
                      size="small"
                      icon={<LocalOfferIcon />}
                    />
                  </ListItem>
                  {index < topRentals.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Special Offers */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Ưu đãi đặc biệt
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                SUMMER10
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Giảm 10% cho tất cả đơn hàng trong mùa hè
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Áp dụng cho đơn hàng từ 500.000đ. Ưu đãi có hiệu lực đến hết 31/08/2025.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/cart')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Sử dụng ngay
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;