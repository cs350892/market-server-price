import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { formatPrice } from '../utils/pricing';

const Checkout = () => {
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [address, setAddress] = useState({
    fullName: '',
    mobileNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load checkout item from localStorage
    const storedItem = localStorage.getItem('checkoutItem');
    if (storedItem) {
      setCheckoutItem(JSON.parse(storedItem));
    } else {
      // If no checkout item, redirect to products
      navigate('/products');
    }
  }, [navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAddress = () => {
    const { fullName, mobileNumber, streetAddress, city, state, pincode } = address;
    if (!fullName.trim()) return 'Full name is required';
    if (!mobileNumber.trim()) return 'Mobile number is required';
    if (!streetAddress.trim()) return 'Street address is required';
    if (!city.trim()) return 'City is required';
    if (!state.trim()) return 'State is required';
    if (!pincode.trim()) return 'Pincode is required';
    if (!/^\d{6}$/.test(pincode)) return 'Pincode must be 6 digits';
    if (!/^\d{10}$/.test(mobileNumber)) return 'Mobile number must be 10 digits';
    return null;
  };

  const handlePlaceOrder = async () => {
    const validationError = validateAddress();
    if (validationError) {
      alert(validationError);
      return;
    }

    if (!checkoutItem || !user || !token) {
      alert('Missing order information. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: [{
          product: checkoutItem.product._id || checkoutItem.product.id,
          productName: checkoutItem.product.name,
          packSize: checkoutItem.packSize,
          quantity: checkoutItem.quantity,
          price: checkoutItem.currentTier.price,
          total: checkoutItem.itemTotal
        }],
        totalAmount: checkoutItem.itemTotal,
        deliveryAddress: address,
        paymentMethod: 'COD', // Cash on Delivery for now
        status: 'pending'
      };

      const response = await fetch('http://localhost:5000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const result = await response.json();

      // Clear checkout item from localStorage
      localStorage.removeItem('checkoutItem');

      // Show success message
      setSuccess(true);

      // Redirect to orders page after a delay
      setTimeout(() => {
        navigate('/orders');
      }, 2000);

    } catch (error) {
      console.error('Order placement error:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Order Placed" showBackButton={false} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">Your order has been confirmed and will be delivered soon.</p>
            <p className="text-sm text-gray-500">Redirecting to orders...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!checkoutItem) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Checkout" showBackButton={true} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Checkout" showBackButton={true} />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex items-center space-x-4 mb-4">
            <img
              src={checkoutItem.product.image}
              alt={checkoutItem.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium">{checkoutItem.product.name}</h3>
              <p className="text-sm text-gray-600">
                Pack: {checkoutItem.packSize.name} × {checkoutItem.quantity}
              </p>
              <p className="text-sm text-gray-600">
                Total Units: {checkoutItem.totalQuantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatPrice(checkoutItem.itemTotal)}</p>
              <p className="text-sm text-gray-500">
                {formatPrice(checkoutItem.currentTier.price)}/unit
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(checkoutItem.itemTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Address Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={address.mobileNumber}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10-digit mobile number"
                maxLength="10"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <textarea
                name="streetAddress"
                value={address.streetAddress}
                onChange={handleAddressChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="House number, street, area"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="State"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6-digit pincode"
                maxLength="6"
                required
              />
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-green-400 font-semibold text-lg transition-colors"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            Payment: Cash on Delivery
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Checkout;