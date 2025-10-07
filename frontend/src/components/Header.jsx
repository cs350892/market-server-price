import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, User, LogIn } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCart();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Market Server Price (MSP)';
    if (path === '/products') return 'Products';
    if (path === '/cart') return 'Cart';
    if (path === '/addresses') return 'My Addresses';
    if (path === '/brands') return 'Brands';
    if (path === '/categories') return 'Categories';
    if (path === '/orders') return 'My Orders';
    if (path === '/admin') return 'Admin Panel';
    return 'AK Wholesaler';
  };
  
  const canGoBack = location.pathname !== '/';
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleUserClick = () => {
    setShowLoginOptions(!showLoginOptions);
  };

  const handleAdminLogin = () => {
    navigate('/admin/login');
    setShowLoginOptions(false);
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4 relative">
          <Link
            to="/cart"
            className="relative p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Link>
          
          <div
            onClick={handleUserClick}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors cursor-pointer relative"
          >
            <User size={20} />
            {showLoginOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                <button
                  onClick={handleAdminLogin}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogIn size={16} /> Admin Login
                </button>
                {/* Add other login options here if needed */}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;