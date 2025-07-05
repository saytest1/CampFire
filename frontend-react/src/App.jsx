import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Import Layout
import DashboardLayout from './components/DashboardLayout';

// Import các components không cần layout
import StartPage from './components/StartPage';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';

// Import các components cần layout
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import EquipmentDetail from './components/EquipmentDetail';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import MyRentals from './components/MyRentals';
import OrderHistory from './components/OrderHistory';

// Create or import your theme
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
          {/* Routes không cần layout */}
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Routes với layout */}
          <Route element={<DashboardLayout />}>
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
          </Route>
          
          {/* Redirect mặc định */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;