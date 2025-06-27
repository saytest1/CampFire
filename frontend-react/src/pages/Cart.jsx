import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [rentalDates, setRentalDates] = useState({ startDate: null, endDate: null });
  const [rentalDays, setRentalDays] = useState(1);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('campingCart') || '[]');
    setCartItems(saved);
  }, []);

  useEffect(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.DailyRate * item.quantity * (item.rentalDays || rentalDays));
    }, 0);
    setTotalCost(subtotal);
  }, [cartItems, rentalDays]);

  const saveCart = items => {
    setCartItems(items);
    localStorage.setItem('campingCart', JSON.stringify(items));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    saveCart(
      cartItems.map(i => i.EquipmentID === id ? { ...i, quantity: qty } : i)
    );
  };

  const removeItem = id => {
    saveCart(cartItems.filter(i => i.EquipmentID !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('campingCart');
  };

  const handleSetRentalDates = item => {
    setSelectedItemId(item.EquipmentID);
    setOpenDateDialog(true);
  };

  const handleDateConfirm = () => {
    if (rentalDates.startDate && rentalDates.endDate) {
      const days = Math.ceil((rentalDates.endDate - rentalDates.startDate) / (1000*60*60*24));
      if (days > 0) {
        saveCart(
          cartItems.map(i =>
            i.EquipmentID === selectedItemId
              ? { ...i, startDate: rentalDates.startDate, endDate: rentalDates.endDate, rentalDays: days }
              : i
          )
        );
        setRentalDays(days);
      }
    }
    setOpenDateDialog(false);
  };

  const handleCheckout = () => {
    if (!cartItems.length) return;
    const missing = cartItems.filter(i => !i.startDate || !i.endDate);
    if (missing.length) {
      alert('Please set rental dates for all items before checkout.');
      return;
    }
    navigate('/checkout', { state: { cartItems, totalCost } });
  };

  if (!cartItems.length) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <ShoppingCartIcon className="text-gray-400 text-8xl mb-4" />
        <h2 className="text-2xl font-medium">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Add some camping equipment to get started!</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Browse Equipment
        </button>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="max-w-6xl mx-auto my-8 px-4">
        <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Items List */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map(item => (
              <div key={item.EquipmentID} className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/200x120'}
                  alt={item.Name}
                  className="w-full sm:w-32 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-medium">{item.Name}</h2>
                  <p className="text-gray-500">{item.Brand} • {item.Category}</p>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                    {item.Status}
                  </span>
                  <p className="text-lg text-blue-600 mt-2">${item.DailyRate}/day</p>

                  {item.startDate && item.endDate ? (
                    <p className="mt-2 text-gray-600">
                      Rental: {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()} ({item.rentalDays} days)
                    </p>
                  ) : (
                    <button
                      onClick={() => handleSetRentalDates(item)}
                      className="mt-2 flex items-center text-blue-600 hover:underline"
                    >
                      <CalendarTodayIcon className="mr-1" /> Set Rental Dates
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center justify-between">
                  <div className="flex items-center border rounded">
                    <button onClick={() => updateQuantity(item.EquipmentID, item.quantity - 1)} className="px-2" disabled={item.quantity <= 1}>
                      <RemoveIcon />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={e => updateQuantity(item.EquipmentID, parseInt(e.target.value) || 1)}
                      className="w-12 text-center"
                    />
                    <button onClick={() => updateQuantity(item.EquipmentID, item.quantity + 1)} className="px-2">
                      <AddIcon />
                    </button>
                  </div>
                  <p className="text-xl text-green-700 mt-2">
                    ${(item.DailyRate * item.quantity * (item.rentalDays || 1)).toFixed(2)}
                  </p>
                  <button onClick={() => removeItem(item.EquipmentID)} className="text-red-600 mt-1">
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button onClick={clearCart} className="text-red-600 underline">Clear Cart</button>
              <button onClick={() => navigate('/dashboard')} className="text-blue-600 underline">Continue Shopping</button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>
            <ul className="space-y-2">
              {cartItems.map(item => (
                <li key={item.EquipmentID} className="flex justify-between">
                  <span>{item.Name} × {item.quantity} ({item.rentalDays || rentalDays}d)</span>
                  <span>${(item.DailyRate * item.quantity * (item.rentalDays || rentalDays)).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t my-4" />
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Tax (8%):</span>
              <span>${(totalCost * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t my-4" />
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total:</span>
              <span className="text-green-700">${(totalCost * 1.08).toFixed(2)}</span>
            </div>
            {cartItems.some(i => !i.startDate || !i.endDate) && (
              <p className="text-yellow-700 mb-4">Please set rental dates for all items before checkout.</p>
            )}
            <button
              onClick={handleCheckout}
              disabled={cartItems.some(i => !i.startDate || !i.endDate)}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 flex items-center justify-center"
            >
              <PaymentIcon className="mr-2" />
              Proceed to Checkout
            </button>
            <p className="text-gray-500 text-sm mt-3 text-center">Secure checkout with SSL encryption</p>
          </div>
        </div>

        {/* Date Selection Dialog */}
        {openDateDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Set Rental Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  label="Start Date"
                  value={rentalDates.startDate}
                  onChange={date => setRentalDates(prev => ({ ...prev, startDate: date }))}
                  renderInput={params => (
                    <input
                      {...params}
                      className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                  )}
                  minDate={new Date()}
                />
                <DatePicker
                  label="End Date"
                  value={rentalDates.endDate}
                  onChange={date => setRentalDates(prev => ({ ...prev, endDate: date }))}
                  renderInput={params => (
                    <input
                      {...params}
                      className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                  )}
                  minDate={rentalDates.startDate || new Date()}
                />
              </div>
              {rentalDates.startDate && rentalDates.endDate && (
                <p className="mt-4 text-blue-600">
                  Rental period: {Math.ceil((rentalDates.endDate - rentalDates.startDate) / (1000*60*60*24))} days
                </p>
              )}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setOpenDateDialog(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDateConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  disabled={!rentalDates.startDate || !rentalDates.endDate}
                >
                  Confirm Dates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default Cart;
