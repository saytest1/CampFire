import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Box 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dữ liệu mẫu - sau này sẽ lấy từ API
  const equipment = {
    id: id,
    name: 'Lều cắm trại 4 người',
    price: 200000,
    description: 'Lều cắm trại chất lượng cao, chống thấm nước, phù hợp cho 4 người',
    image: '/tent-detail.jpg',
    available: true
  };

  const handleBooking = () => {
    navigate(`/booking/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0}>
            <img 
              src={equipment.image} 
              alt={equipment.name}
              style={{ width: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {equipment.name}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            {equipment.price.toLocaleString('vi-VN')}đ / ngày
          </Typography>
          <Typography variant="body1" paragraph>
            {equipment.description}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleBooking}
              disabled={!equipment.available}
              fullWidth
            >
              {equipment.available ? 'Đặt thuê ngay' : 'Hết hàng'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EquipmentDetail;