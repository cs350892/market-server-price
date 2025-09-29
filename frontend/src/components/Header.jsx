import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = ({ 
  title, 
  showBackButton = false, 
  showCartIcon = true 
}) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="mr-3 p-1 rounded-full hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      {showCartIcon && (
        <button
          onClick={handleCartClick}
          className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      )}
    </header>
  );
};

export default Header;