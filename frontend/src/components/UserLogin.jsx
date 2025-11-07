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
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">User Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="user@marketserverprice.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter password"
            required
          />
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