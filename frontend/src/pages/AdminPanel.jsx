import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Search, Filter, Download, MessageSquare } from 'lucide-react';
import { sampleProducts } from '../data/sampleData';

const AdminPanel = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: 0,
    stock: 0,
    category: '',
    brand: ''
  });

  // Mock data for dashboard
  const dashboardData = {
    todaysSales: 1500,
    totalRevenue: 25000,
    totalOrders: 120,
    pendingOrders: 15,
    last7DaysSales: [100, 150, 200, 180, 220, 250, 300]
  };

  const orders = [
    { id: 'ORD001', product: 'Parle-G', status: 'pending', date: '2025-10-06', amount: 200 },
    { id: 'ORD002', product: 'Haldiram’s Bhujia', status: 'shipped', date: '2025-10-05', amount: 300 },
    { id: 'ORD003', product: 'Lifebuoy Soap', status: 'delivered', date: '2025-10-04', amount: 150 }
  ];

  const payouts = [
    { id: 'PAY001', date: '2025-10-01', amount: 5000, status: 'Completed' },
    { id: 'PAY002', date: '2025-09-25', amount: 4500, status: 'Completed' }
  ];

  const offers = [
    { id: 'OFF001', code: 'SAVE10', discount: 10, active: true, expiry: '2025-10-15' },
    { id: 'OFF002', code: 'WELCOME20', discount: 20, active: false, expiry: '2025-09-30' }
  ];

  const messages = [
    { id: 'MSG001', from: 'Customer', content: 'When will my order arrive?', date: '2025-10-07' },
    { id: 'MSG002', from: 'Support', content: 'Your issue is resolved.', date: '2025-10-06' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: formData.name,
      image: formData.image,
      mrp: formData.price,
      pricingTiers: { consumer: { price: formData.price, margin: 0 } },
      stock: formData.stock,
      category: formData.category,
      brand: formData.brand,
      description: ''
    };
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      setProducts([...products, productData]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', image: '', price: 0, stock: 0, category: '', brand: '' });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      image: product.image,
      price: product.mrp,
      stock: product.stock,
      category: product.category,
      brand: product.brand
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === 'All' || product.category === categoryFilter)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Dashboard Overview */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Today's Sales</p>
            <p className="text-lg font-bold">₹{dashboardData.todaysSales}</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-lg font-bold">₹{dashboardData.totalRevenue}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-lg font-bold">{dashboardData.totalOrders}</p>
          </div>
          <div className="p-3 bg-red-50 rounded">
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-lg font-bold">{dashboardData.pendingOrders}</p>
          </div>
        </div>
        <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
          <p>Graph (Last 7 Days Sales: {dashboardData.last7DaysSales.join(', ')})</p>
          {/* Placeholder for graph - use Chart.js or similar library */}
        </div>
      </div>

      {/* Product Management */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Product Management</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="p-2 border rounded w-full md:w-1/2"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All Categories</option>
            {['Biscuits & Cookies', 'Namkeen & Snacks', 'Paan Masala / Mouth Freshener', 'Soap / Personal Wash', 'Shampoo / Hair Care'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => { resetForm(); setShowAddForm(true); }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded" />
                    <span>{product.name} ({product.brand})</span>
                  </div>
                </td>
                <td className="p-3">₹{product.mrp}</td>
                <td className="p-3">
                  <span className={product.stock < 20 ? 'text-red-500' : 'text-green-500'}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-500 hover:bg-blue-100 rounded">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-100 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{editingProduct ? 'Edit' : 'Add'} Product</h3>
                <button onClick={resetForm} className="p-1 hover:bg-gray-200 rounded">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Product Name"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Image URL"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="Price"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  placeholder="Stock"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Category"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Brand"
                  className="w-full p-2 border rounded"
                  required
                />
                <div className="flex gap-2">
                  <button type="button" onClick={resetForm} className="flex-1 p-2 border rounded text-gray-600 hover:bg-gray-100">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-1">
                    <Save size={18} /> {editingProduct ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Order Management */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Management</h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.product}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => console.log('Update status:', e.target.value)} // Replace with API call
                    className="p-1 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3">₹{order.amount}</td>
                <td className="p-3">
                  <button className="p-2 text-blue-500 hover:bg-blue-100 rounded">Print Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payments & Reports */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Payments & Reports</h2>
        <div className="mb-4">
          <p className="text-lg font-bold">Total Earnings: ₹{payouts.reduce((sum, p) => sum + p.amount, 0)}</p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Payout ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(payout => (
              <tr key={payout.id} className="border-t">
                <td className="p-3">{payout.id}</td>
                <td className="p-3">{payout.date}</td>
                <td className="p-3">₹{payout.amount}</td>
                <td className="p-3">{payout.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1">
          <Download size={18} /> Download Report
        </button>
      </div>

      {/* Offers & Coupons */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Offers & Coupons</h2>
        <button
          onClick={() => alert('Add new offer form here')}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus size={18} /> Add Offer
        </button>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Discount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.id} className="border-t">
                <td className="p-3">{offer.code}</td>
                <td className="p-3">{offer.discount}%</td>
                <td className="p-3">{offer.active ? 'Active' : 'Expired'}</td>
                <td className="p-3">{offer.expiry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Messages / Support */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Messages / Support</h2>
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="p-3 bg-gray-50 rounded">
              <p><strong>{msg.from}:</strong> {msg.content}</p>
              <p className="text-sm text-gray-500">{msg.date}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 p-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1">
          <MessageSquare size={18} /> New Message
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;