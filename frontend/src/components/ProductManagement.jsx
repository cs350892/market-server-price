import React, { useState } from 'react';
import { mockProducts, mockCategories } from '../data/mockData';

const ProductManagement = () => {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', image: '', mrp: '', category: '', brand: '', stock: '',
    pricingTiers: [{ range: '1-20', minQuantity: 1, maxQuantity: 20, price: 0, margin: 37 }],
    packSizes: [{ id: '1', name: 'Pack of 1', multiplier: 1 }],
    type: 'high-margin',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory ? product.category === filterCategory : true)
  );

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts([...products, { id: String(products.length + 1), ...newProduct }]);
    setNewProduct({
      name: '', image: '', mrp: '', category: '', brand: '', stock: '',
      pricingTiers: [{ range: '1-20', minQuantity: 1, maxQuantity: 20, price: 0, margin: 37 }],
      packSizes: [{ id: '1', name: 'Pack of 1', multiplier: 1 }],
      type: 'high-margin',
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Product Management</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {mockCategories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      <form onSubmit={handleAddProduct} className="bg-white p-4 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="MRP"
            value={newProduct.mrp}
            onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Brand"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Select Category</option>
            {mockCategories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <img src={product.image} alt={product.name} className="h-32 w-full object-cover rounded" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Brand: {product.brand}</p>
            <p>MRP: ₹{product.mrp}</p>
            <p>Stock: {product.stock}</p>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;