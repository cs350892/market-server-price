import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AddressProvider } from './context/AddressContext';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Brands from './pages/Brands';
import Categories from './pages/Categories';
import Addresses from './pages/Addresses';
import Cart from './pages/Cart';
import BuyAgain from './pages/BuyAgain';
import Orders from './pages/Orders';
import Offers from './pages/Offers';
import Admin from './pages/Admin';

function App() {
  return (
    <CartProvider>
      <AddressProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/buy-again" element={<BuyAgain />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </Router>
      </AddressProvider>
    </CartProvider>
  );
}

export default App;