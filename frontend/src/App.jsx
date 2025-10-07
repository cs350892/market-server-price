import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AddressesPage from './pages/AddressesPage';
import BrandsPage from './pages/BrandsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import AdminPanel from './pages/AdminPanel';
import { AdminAuthProvider } from './contexts/AdminAuth'
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pb-16 md:pb-0">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/addresses" element={<AddressesPage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
               <Route path="/admin" element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>} />
            <Route path="/admin/login" element={<AdminLogin />} />
              </Routes>
              <Footer/>
            </main>
            <BottomNavigation />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;