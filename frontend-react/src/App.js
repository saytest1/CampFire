import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import StartPage from './pages/StartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RoomDetail from './pages/RoomDetail';
import BookingForm from './pages/BookingForm';
import BookingList from './pages/BookingList';
import BookingDetail  from './pages/BookingDetail';
import PaymentForm from './pages/PaymentForm';
import ServiceList from './pages/ServiceList';
import ServiceForm from './pages/ServiceForm';

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
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/booking/new/:roomId" element={<BookingForm />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/booking/:id" element={<BookingDetail />} />
          <Route path="/booking/:id/pay" element={<PaymentForm />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/new" element={<ServiceForm />} />
          <Route path="/services/edit/:id" element={<ServiceForm />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
