import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking'); // checking, success, failed
  const [message, setMessage] = useState('Verifying payment...');
  const { apiFetch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get transaction ID from URL params
      const transactionId = searchParams.get('transactionId') || 
                           searchParams.get('merchantTransactionId');

      if (!transactionId) {
        setStatus('failed');
        setMessage('Invalid payment transaction');
        return;
      }

      // Check payment status from backend
      const response = await apiFetch(`/api/v1/payment/status/${transactionId}`);

      if (response.success) {
        if (response.paymentStatus === 'paid') {
          setStatus('success');
          setMessage('Payment successful! Your order has been confirmed.');
          
          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            navigate('/orders');
          }, 3000);
        } else if (response.paymentStatus === 'failed') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
        } else {
          setStatus('failed');
          setMessage('Payment is still pending. Please check your orders.');
        }
      } else {
        setStatus('failed');
        setMessage('Unable to verify payment status.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage('Error verifying payment. Please contact support.');
    }
  };

  const renderIcon = () => {
    if (status === 'checking') {
      return <Loader className="animate-spin text-blue-600" size={64} />;
    } else if (status === 'success') {
      return <CheckCircle className="text-green-600" size={64} />;
    } else {
      return <XCircle className="text-red-600" size={64} />;
    }
  };

  const getStatusColor = () => {
    if (status === 'checking') return 'text-blue-600';
    if (status === 'success') return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Payment Status" showBackButton={false} />

      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            {renderIcon()}
          </div>

          <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {status === 'checking' ? 'Verifying Payment' : 
             status === 'success' ? 'Payment Successful!' : 
             'Payment Failed'}
          </h2>

          <p className="text-gray-600 mb-6">{message}</p>

          {status !== 'checking' && (
            <div className="space-y-3">
              {status === 'success' && (
                <p className="text-sm text-gray-500">
                  Redirecting to orders in a few seconds...
                </p>
              )}
              
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View My Orders
              </button>

              {status === 'failed' && (
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Back to Cart
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PaymentCallback;
