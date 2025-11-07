import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { MessageSquare, Send } from 'lucide-react';

const Messages = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.subject.trim()) return 'Subject is required';
    if (!formData.message.trim()) return 'Message is required';
    if (formData.subject.trim().length < 5) return 'Subject must be at least 5 characters';
    if (formData.message.trim().length < 10) return 'Message must be at least 10 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user || !token) {
      setError('Please login to send a message');
      return;
    }

    setLoading(true);

    try {
      const messageData = {
        from: user.name,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        category: 'general'
      };

      const response = await fetch('http://localhost:5000/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      const result = await response.json();
      console.log('Message sent:', result);

      // Show success message
      setSuccess(true);

      // Clear form
      setFormData({
        subject: '',
        message: ''
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Message send error:', error);
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Help & Support" showBackButton={true} />

      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <MessageSquare size={48} className="text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Contact Support</h1>
            <p className="text-gray-600 mt-2">
              Have a question or need help? Send us a message and we'll get back to you.
            </p>
          </div>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <div className="text-green-500 mr-2">✓</div>
                <span>Message sent successfully! We'll get back to you soon.</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your query"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="6"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please describe your question or issue in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">What we can help with:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Product information and availability</li>
              <li>• Order status and tracking</li>
              <li>• Delivery and shipping questions</li>
              <li>• Returns and refunds</li>
              <li>• Technical issues</li>
              <li>• General feedback and suggestions</li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Messages;