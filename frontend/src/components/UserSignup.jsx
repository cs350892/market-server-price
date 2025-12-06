import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserSignup = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with:', { name, email, password: '***' });
      const result = await signup(name.trim(), email.toLowerCase(), password);
      console.log('Signup result:', result);

      if (result.success) {
        setSuccess(result.message || 'Account created successfully!');
        setError('');

        // Close modal and redirect after success
        setTimeout(() => {
          if (onSuccess) onSuccess();
          navigate(result.user?.role === 'admin' ? '/admin' : '/', { replace: true });
        }, 1500);
      } else {
        console.error('Signup failed:', result.message);
        setError(result.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
      <p className="text-gray-600 text-sm">
        Join us to access exclusive products and deals
      </p>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            placeholder="Enter your full name"
            required
            style={{ color: '#000000' }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            placeholder="your@email.com"
            required
            style={{ color: '#000000' }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            placeholder="Create a password (min 6 characters)"
            required
            style={{ color: '#000000' }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            placeholder="Confirm your password"
            required
            style={{ color: '#000000' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:bg-blue-300 font-medium transition-colors"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          disabled={loading}
          className="w-full bg-gray-300 text-gray-800 px-4 py-3 rounded hover:bg-gray-400 disabled:bg-gray-200 font-medium transition-colors"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserSignup;