import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Twitter, Instagram, Facebook } from 'lucide-react';
import { mockCategories, mockBrands } from '../data/mockData';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-blue-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-blue-400 transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-blue-400 transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/addresses" className="hover:text-blue-400 transition-colors">
                  Addresses
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {mockCategories.slice(0, 4).map(category => (
                <li key={category.id}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information & Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Kanpur, Lal Bangla Market</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>1234567890</span> {/* Added missing phone number */}
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@marketserverprice.com</span>
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Location</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.799580732949!2d80.38856041500255!3d26.419434949996233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c411921db85fd%3A0xe97e401661f785d3!2sLal%20Bangla%20Market%2C%20Kanpur%2C%20Uttar%20Pradesh%20208001!5e0!3m2!1sen!2sin!4v1695312000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Store Location"
              ></iframe>
            </div>
            <a
              href="https://www.google.com/maps/place/Lal+Bangla+Market,+Kanpur,+Uttar+Pradesh+208001/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-400 hover:text-blue-300 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-400">
          &copy; 2025 Market Server Price. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;