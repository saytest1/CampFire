import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
} from '@mui/material';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import StoreIcon from '@mui/icons-material/Store';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';

import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      name: 'Trang chính',
      icon: <HomeIcon fontSize="large" color="primary" />,
      description: 'Khám phá giao diện bắt đầu',
      route: '/',
    },
    {
      name: 'Giỏ hàng',
      icon: <ShoppingCartIcon fontSize="large" color="secondary" />,
      description: 'Xem giỏ hàng hiện tại của bạn',
      route: '/cart',
    },
    {
      name: 'Thanh toán',
      icon: <PaymentIcon fontSize="large" color="success" />,
      description: 'Tiến hành thanh toán đơn hàng',
      route: '/checkout',
    },
    {
      name: 'Danh mục sản phẩm',
      icon: <CategoryIcon fontSize="large" color="primary" />,
      description: 'Khám phá các thiết bị cắm trại',
      route: '/categories',
    },
    {
      name: 'Danh sách sản phẩm',
      icon: <StoreIcon fontSize="large" color="secondary" />,
      description: 'Xem toàn bộ sản phẩm đang bán',
      route: '/products',
    },
    {
      name: 'Chi tiết sản phẩm',
      icon: <InfoIcon fontSize="large" color="info" />,
      description: 'Thông tin cụ thể từng sản phẩm',
      route: '/product-detail',
    },
    {
      name: 'Lịch sử đơn hàng',
      icon: <HistoryIcon fontSize="large" color="warning" />,
      description: 'Theo dõi đơn hàng đã đặt',
      route: '/order-history',
    },
    {
      name: 'Đơn thuê của tôi',
      icon: <AssignmentReturnIcon fontSize="large" color="info" />,
      description: 'Xem danh sách thiết bị đã thuê',
      route: '/my-rentals',
    },
  ];

  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        CampFire Dashboard
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              elevation={2}
              onClick={() => navigate(feature.route)}
              sx={{
                p: 3,
                cursor: 'pointer',
                borderRadius: 3,
                textAlign: 'center',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box mb={1}>{feature.icon}</Box>
              <Typography fontWeight="600">{feature.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard;
