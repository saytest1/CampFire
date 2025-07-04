import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

// Pages

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
