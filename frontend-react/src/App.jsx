import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Import all your components
import StartPage from './components/StartPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import EquipmentDetail from './components/EquipmentDetail';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';
import Cart from './components/Cart';
import MyRentals from './components/MyRentals';
import Products from './components/Products';
import ProductDetail from './pages/ProductDetail';
import ResetPassword from './components/ResetPassword';
import OrderHistory from './pages/OrderHistory';
import Checkout from './components/Checkout';

// Create or import your theme
const theme = createTheme({
  // Your theme configuration here
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;