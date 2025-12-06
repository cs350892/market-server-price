import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserLogin = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        if (closeModal) closeModal();
        navigate(result.user?.role === 'admin' ? '/admin' : '/profile');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">User Login</h2>
      {error && <p className="text-red-500 bg-red-50 p-2 rounded">{error}</p>}
      
      {/* Debug info */}
      <div className="bg-gray-100 p-2 rounded text-sm">
        <p>Debug: Email: "{email}" | Password length: {password.length}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              console.log('Email changed to:', e.target.value);
              setEmail(e.target.value);
            }}
            className="w-full p-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            placeholder="user@marketserverprice.com"
            required
            style={{ color: '#000000' }}
          />
          <p className="text-xs text-gray-500">Current value: {email}</p>
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              console.log('Password changed to:', e.target.value.length + ' characters');
              setPassword(e.target.value);
            }}
            className="w-full p-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            placeholder="Enter password"
            required
            style={{ color: '#000000' }}
          />
          <p className="text-xs text-gray-500">Password length: {password.length}</p>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;