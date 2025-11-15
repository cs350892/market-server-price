import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AddressProvider } from './context/AddressContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Brands from './pages/Brands';
import Categories from './pages/Categories';
import Addresses from './pages/Addresses';
import Cart from './pages/Cart';
import BuyAgain from './pages/BuyAgain';
import Orders from './pages/Orders';
// import Offers from './pages/Offers';
import OfferManagementDashboard from './pages/OfferManagementDashboard';
import Checkout from './pages/Checkout';
import Messages from './pages/Messages';
import Admin from './pages/Admin';
import AdminPanel from './pages/adminPanel';
import CreateNewProduct from './pages/CreateNewProduct';
import UpdateProduct from './pages/UpdateProduct';
import UserLogin from './pages/UserLogin';
import PaymentCallback from './pages/PaymentCallback';

function App() {
  return (
    <AuthProvider>
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
                {/* <Route path="/offers" element={<Offers />} /> */}
                <Route path="/offers" element={<OfferManagementDashboard />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path='/createNewProduct' element={<CreateNewProduct />} />
                <Route path='/update/:id' element={<UpdateProduct />} />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;