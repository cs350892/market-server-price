import React, { useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import { mockProducts } from '../data/mockData';

const Admin = () => {
  const [products, setProducts] = useState(mockProducts);

  const handleAddProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, product]);
  };

  const handleUpdateProduct = (id, updatedProduct) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <AdminPanel
      products={products}
      onAddProduct={handleAddProduct}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
    />
  );
};

export default Admin;