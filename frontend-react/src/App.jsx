import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

// Pages
import StartPage from './pages/StartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookingForm from './pages/BookingForm';
import PaymentForm from './pages/PaymentForm';
import Categories from './pages/Categories';
import EquipmentDetail from './pages/EquipmentDetail';
import Cart from './pages/Cart';
import MyRentals from './pages/MyRentals';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep blue for luxury feel
    },
    secondary: {
      main: '#c41e3a', // Rich red for accent
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<EquipmentDetail />} />
          <Route path="/booking/new/:equipmentId" element={<BookingForm />} />
          <Route path="/booking/:id/pay" element={<PaymentForm />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/myrentals" element={<MyRentals />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
