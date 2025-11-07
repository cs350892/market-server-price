import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Clear any errors when component mounts
  useEffect(() => {
    setError('');
    setSuccess('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      const result = await login(email, password);
      console.log('Login result:', result);
      console.log('User from result:', result.user);
      console.log('User role:', result.user?.role);
      
      if (result.success) {
        if (result.user && result.user.role === 'admin') {
          console.log('Admin login successful, redirecting to /admin...');
          setSuccess('Login successful! Redirecting...');
          setError(''); // Clear any previous errors
          if (closeModal) closeModal();
          // Redirect immediately
          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 500);
        } else {
          console.error('User is not admin. User object:', JSON.stringify(result.user));
          console.error('Role check failed. Expected: "admin", Got:', result.user?.role);
          setError('Access denied. Admin privileges required. Your role: ' + (result.user?.role || 'undefined'));
        }
      } else {
        console.error('Login failed:', result.message);
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Admin Login</h2>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@marketserverprice.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:bg-blue-300 font-medium"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;