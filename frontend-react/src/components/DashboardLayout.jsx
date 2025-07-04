import React from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import CategoryIcon from '@mui/icons-material/Category';
import StoreIcon from '@mui/icons-material/Store';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
  { text: 'Trang chính', icon: <HomeIcon />, route: '/' },
  { text: 'Giỏ hàng', icon: <ShoppingCartIcon />, route: '/cart' },
  { text: 'Thanh toán', icon: <PaymentIcon />, route: '/checkout' },
  { text: 'Danh mục', icon: <CategoryIcon />, route: '/categories' },
  { text: 'Sản phẩm', icon: <StoreIcon />, route: '/products' },
  { text: 'Chi tiết sản phẩm', icon: <InfoIcon />, route: '/product-detail' },
  { text: 'Lịch sử đơn hàng', icon: <HistoryIcon />, route: '/order-history' },
  { text: 'Đơn thuê của tôi', icon: <AssignmentReturnIcon />, route: '/my-rentals' },
];

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            CampFire
          </Typography>
        </Toolbar>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => navigate(item.route)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content (Ảnh nền + mô tả) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          backgroundImage: 'url("https://www.pixelstalk.net/wp-content/uploads/2016/11/Photo-of-Campfire.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            p: 5,
            borderRadius: 3,
            textAlign: 'center',
            color: 'white',
            maxWidth: 700,
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Chào mừng đến với CampFire
          </Typography>
          <Typography variant="h6" gutterBottom>
            Nơi bạn có thể thuê và mua các thiết bị cắm trại chất lượng
          </Typography>
          <Typography variant="body1">
            Khám phá danh mục sản phẩm như lều trại, túi ngủ, bếp dã ngoại và nhiều hơn thế nữa để chuẩn bị cho chuyến phiêu lưu của bạn.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
