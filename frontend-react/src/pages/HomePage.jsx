import React from 'react';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PRIMARY_COLOR = '#e87722';

const heroSlides = [
  {
    image: '/hero1.jpg',
    title: 'CT STRIKE MULTICAM BLACK',
    subtitle: 'NEW COLOR',
    description: 'www.chuyentactical.com',
  },
  {
    image: '/hero2.jpg',
    title: 'CT VIVU',
    subtitle: 'Tactical Sling Bag',
    description: 'Chuyên dụng cho mọi hành trình',
  },
];

const products = [
  { name: "Naturehike Cloud Up 2", price: 54.23, image: "/tent-main.jpg" },
  { name: "Coleman Sundome 4P", price: 92.11, image: "/tent-inside.jpg" },
  { name: "MSR Hubba Hubba NX", price: 81.77, image: "/tent-setup.jpg" },
  { name: "Nike Air Zoom", price: 49.99, image: "/shoes1.jpg" },
  { name: "Adidas Ultraboost", price: 59.99, image: "/shoes2.jpg" },
  { name: "New Balance 1080", price: 39.99, image: "/shoes3.jpg" },
  { name: "The North Face Jacket", price: 79.99, image: "/jacket1.jpg" },
  { name: "Patagonia Nano Puff", price: 89.99, image: "/jacket2.jpg" },
  { name: "Columbia Silver Ridge", price: 29.99, image: "/jacket3.jpg" },
  { name: "Stanley 10-in-1", price: 19.99, image: "/pliers1.jpg" },
  { name: "Knipex 10-in-1", price: 19.99, image: "/pliers2.jpg" },
  { name: "Channellock 10-in-1", price: 19.99, image: "/pliers3.jpg" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box>
      {/* Hero Carousel */}
      <Box sx={{ position: 'relative', width: '100%', height: { xs: 240, md: 420 }, overflow: 'hidden', mb: 4 }}>
        {heroSlides.map((slideData, idx) => (
          <Box
            key={idx}
            sx={{
              display: idx === slide ? 'block' : 'none',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              transition: 'opacity 0.5s',
            }}
          >
            <img
              src={slideData.image}
              alt={slideData.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
            />
            <Box sx={{ position: 'absolute', top: { xs: 40, md: 80 }, left: { xs: 20, md: 80 }, color: '#fff' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', textShadow: '2px 2px 8px #000', mb: 1 }}>
                {slideData.title}
              </Typography>
              <Typography variant="h5" sx={{ color: PRIMARY_COLOR, fontWeight: 700, mb: 1 }}>
                {slideData.subtitle}
              </Typography>
              <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>{slideData.description}</Typography>
              <Button variant="contained" sx={{ bgcolor: PRIMARY_COLOR, fontWeight: 700 }} onClick={() => navigate('/products')}>Xem sản phẩm</Button>
            </Box>
          </Box>
        ))}
        {/* Carousel controls */}
        <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
          {heroSlides.map((_, idx) => (
            <Box key={idx} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: idx === slide ? PRIMARY_COLOR : '#fff', opacity: 0.8, cursor: 'pointer' }} onClick={() => setSlide(idx)} />
          ))}
        </Box>
      </Box>
      {/* Product Grid */}
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, color: PRIMARY_COLOR, mb: 3 }}>Sản phẩm nổi bật</Typography>
        <Grid container spacing={3}>
          {products.map((product, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                  <Typography variant="body1" sx={{ color: PRIMARY_COLOR, fontWeight: 700 }}>{product.price.toLocaleString('vi-VN')}đ</Typography>
                </CardContent>
                <CardActions sx={{ mt: 'auto', p: 2 }}>
                  <Button fullWidth variant="contained" sx={{ bgcolor: PRIMARY_COLOR, fontWeight: 700 }} onClick={() => navigate(`/products/${idx+1}`)}>
                    Xem chi tiết
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 