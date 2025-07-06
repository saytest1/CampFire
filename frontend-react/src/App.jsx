import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Import Layout
import DashboardLayout from './pages/DashboardLayout';

// Import các components không cần layout
import StartPage from './pages/StartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';

// Import các components cần layout
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import EquipmentDetail from './pages/EquipmentDetail';
import BookingForm from './pages/BookingForm';
import PaymentForm from './pages/PaymentForm';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyRentals from './pages/MyRentals';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProductImageUpload from './pages/admin/AdminProductImageUpload';

// Components
import NavBar from './components/NavBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9F7AEA',
      dark: '#553C9A',
    },
    secondary: {
      main: '#F56565',
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Routes với layout */}
          <Route element={<DashboardLayout />}>
            {/* Route trực tiếp đến Categories để test */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/booking/:equipmentId" element={<BookingForm />} />
            <Route path="/payment/:bookingId" element={<PaymentForm />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-rentals" element={<MyRentals />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/products/:productId/review" element={<ReviewList/>} />
            <Route path="/products/:productId/review/new" element={<ReviewForm/>} />
          </Route>
          
          {/* Redirect mặc định */}
          <Route path="/components/admin/Dashboard" element={<AdminDashboard />} />
          <Route path="/admin/upload-image" element={<AdminProductImageUpload />} />
          <Route path="/admin/reviews/:productId" element={<AdminReviewManagement productId={productId} client={apolloClient} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;