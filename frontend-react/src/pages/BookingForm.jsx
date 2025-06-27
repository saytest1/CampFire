import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';

const BookingForm = () => {
  const { equipmentId } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    quantity: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
    deliveryOption: 'pickup',
    deliveryAddress: ''
  });
  const [errors, setErrors] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [rentalDays, setRentalDays] = useState(0);

  // Fetch equipment details
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`http://10.11.10.13/api/equipment/${equipmentId}`);
        const data = await res.json();
        if (data.success) {
          setEquipment(data.data);
        }
      } catch (err) {
        console.error('Error fetching equipment:', err);
      }
    };
    if (equipmentId) fetchEquipment();
  }, [equipmentId]);

  // Calculate days & cost
  useEffect(() => {
    if (formData.startDate && formData.endDate && equipment) {
      const days = Math.ceil((formData.endDate - formData.startDate) / (1000*60*60*24));
      if (days > 0) {
        setRentalDays(days);
        const subtotal = days * formData.quantity * equipment.DailyRate;
        const deliveryFee = formData.deliveryOption === 'delivery' ? 25 : 0;
        setTotalCost(subtotal + deliveryFee);
      }
    }
  }, [formData.startDate, formData.endDate, formData.quantity, formData.deliveryOption, equipment]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErr = {};
    if (!formData.startDate) newErr.startDate = 'Start date is required';
    if (!formData.endDate) newErr.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErr.endDate = 'End date must be after start date';
    }
    if (!formData.customerName.trim()) newErr.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) newErr.customerEmail = 'Email is required';
    if (!formData.customerPhone.trim()) newErr.customerPhone = 'Phone is required';
    if (formData.deliveryOption === 'delivery' && !formData.deliveryAddress.trim()) {
      newErr.deliveryAddress = 'Delivery address is required';
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const bookingData = {
        equipmentId: equipment.EquipmentID,
        ...formData,
        totalCost,
        rentalDays,
        status: 'pending'
      };
      const res = await fetch('http://10.11.10.13/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const result = await res.json();
      if (result.success) {
        navigate('/payment', { state: { bookingId: result.bookingId, bookingData } });
      } else {
        setErrors({ submit: 'Failed to create booking. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!equipment) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <p>Loading equipment details...</p>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="max-w-3xl mx-auto my-8 px-4">
        <h1 className="text-3xl font-semibold mb-6">Book Equipment</h1>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Summary */}
          <div className="lg:w-1/3 bg-white shadow rounded-lg overflow-hidden">
            <img
              src={equipment.images?.[0] || 'https://via.placeholder.com/200x150'}
              alt={equipment.Name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-medium">{equipment.Name}</h2>
              <p className="text-gray-500">{equipment.Brand}</p>
              <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                {equipment.Category}
              </span>
              <p className="text-2xl text-green-600 mt-4">${equipment.DailyRate}/day</p>
              {rentalDays > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Cost Breakdown</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>{rentalDays} days × {formData.quantity} items</span>
                      <span>${rentalDays * formData.quantity * equipment.DailyRate}</span>
                    </li>
                    {formData.deliveryOption === 'delivery' && (
                      <li className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>$25</span>
                      </li>
                    )}
                    <li className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-green-700">${totalCost}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:w-2/3 bg-white shadow rounded-lg p-6 space-y-6"
          >
            <h2 className="text-xl font-medium">Rental Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={date => handleInputChange('startDate', date)}
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
                value={formData.endDate}
                onChange={date => handleInputChange('endDate', date)}
                renderInput={params => (
                  <input
                    {...params}
                    className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  />
                )}
                minDate={formData.startDate || new Date()}
              />
              <input
                type="number"
                min="1"
                max="10"
                value={formData.quantity}
                onChange={e => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                className="w-full border rounded px-3 py-2"
                placeholder="Quantity"
              />
            </div>

            <h2 className="text-xl font-medium mt-6">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.customerName}
                onChange={e => handleInputChange('customerName', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                value={formData.customerEmail}
                onChange={e => handleInputChange('customerEmail', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
                required
              />
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={e => handleInputChange('customerPhone', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Phone Number"
                required
              />
              <select
                value={formData.deliveryOption}
                onChange={e => handleInputChange('deliveryOption', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="pickup">Store Pickup (Free)</option>
                <option value="delivery">Delivery (+$25)</option>
              </select>
            </div>

            {formData.deliveryOption === 'delivery' && (
              <textarea
                value={formData.deliveryAddress}
                onChange={e => handleInputChange('deliveryAddress', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows="2"
                placeholder="Delivery Address"
                required
              />
            )}
            <textarea
              value={formData.specialRequests}
              onChange={e => handleInputChange('specialRequests', e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows="3"
              placeholder="Special Requests (Optional)"
            />

            {errors.submit && (
              <div className="text-red-600">{errors.submit}</div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-300 rounded px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white rounded px-4 py-2 flex items-center justify-center disabled:opacity-50"
                disabled={loading}
              >
                <PaymentIcon className="mr-2" />
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BookingForm;