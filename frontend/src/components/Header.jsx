import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import UserLogin from '../pages/UserLogin';

const Header = ({ title, showBackButton }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/profile'); // Redirect to user profile or dashboard
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Link to="/" className="hover:text-blue-200">
              <ArrowLeft size={24} />
            </Link>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to={isAdmin ? '/admin' : '/profile'} className="hover:text-blue-200">
                {isAdmin ? 'Admin Panel' : 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center space-x-2 bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              <User size={20} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <UserLogin closeModal={() => setIsLoginModalOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;