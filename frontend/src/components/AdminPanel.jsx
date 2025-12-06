// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { formatPrice, formatMargin } from '../utils/pricing';

const API_BASE = '/api/products';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', image: '', mrp: '', category: '', brand: '', stock: '', description: '',
    pricingTiers: [
      { range: '1-20', minQuantity: 1, maxQuantity: 20, price: 0, margin: 37 },
      { range: '21-100', minQuantity: 21, maxQuantity: 100, price: 0, margin: 45 },
      { range: '100+', minQuantity: 101, maxQuantity: null, price: 0, margin: 55 },
    ],
    packSizes: [{ id: '1', name: 'Pack of 1', multiplier: 1 }],
    type: 'high-margin',
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate price from MRP + margin
  const calculatePrice = (mrp, margin) => {
    return mrp * (1 - margin / 100);
  };

  // Update pricing tier
  const updateTier = (index, field, value) => {
    const tiers = [...formData.pricingTiers];
    tiers[index] = { ...tiers[index], [field]: value };

    if (field === 'margin' && formData.mrp) {
      tiers[index].price = calculatePrice(formData.mrp, value);
    }
    if (field === 'price' && formData.mrp) {
      tiers[index].margin = ((1 - value / formData.mrp) * 100).toFixed(1);
    }

    setFormData({ ...formData, pricingTiers: tiers });
  };

  // Auto update all tiers when MRP changes
  const handleMrpChange = (mrp) => {
    const updatedTiers = formData.pricingTiers.map(tier => ({
      ...tier,
      price: calculatePrice(mrp, tier.margin)
    }));
    setFormData({ ...formData, mrp, pricingTiers: updatedTiers });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mrp: parseFloat(formData.mrp),
          stock: parseInt(formData.stock),
          pricingTiers: formData.pricingTiers.map(t => ({
            ...t,
            price: parseFloat(t.price.toFixed(2)),
            margin: parseFloat(t.margin),
          })),
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      await fetchProducts(); // Refresh list
      resetForm();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      name: '', image: '', mrp: '', category: '', brand: '', stock: '', description: '',
      pricingTiers: [
        { range: '1-20', minQuantity: 1, maxQuantity: 20, price: 0, margin: 37 },
        { range: '21-100', minQuantity: 21, maxQuantity: 100, price: 0, margin: 45 },
        { range: '100+', minQuantity: 101, maxQuantity: null, price: 0, margin: 55 },
      ],
      packSizes: [{ id: '1', name: 'Pack of 1', multiplier: 1 }],
      type: 'high-margin',
    });
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData(product);
    setShowAddForm(true);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      await fetchProducts();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  placeholder="Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="p-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#000000' }}
                  required
                />
                <input
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="p-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#000000' }}
                  required
                />
                <input
                  type="number"
                  placeholder="MRP"
                  value={formData.mrp}
                  onChange={e => handleMrpChange(parseFloat(e.target.value) || 0)}
                  className="p-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#000000' }}
                  required
                />
                <input
                  placeholder="Category"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="p-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#000000' }}
                  required
                />
                <input
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="p-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#000000' }}
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  className="p-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#000000' }}
                  required
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500"
                style={{ color: '#000000' }}
                rows={2}
              />

              <div>
                <h3 className="font-semibold mb-2">Pricing Tiers</h3>
                {formData.pricingTiers.map((tier, i) => (
                  <div key={i} className="flex gap-2 mb-2 p-2 bg-gray-50 rounded">
                    <input value={tier.range} readOnly className="w-24 p-2 bg-gray-100 text-xs" />
                    <input
                      type="number"
                      placeholder="Margin %"
                      value={tier.margin}
                      onChange={e => updateTier(i, 'margin', parseFloat(e.target.value))}
                      className="w-24 p-2 border rounded text-sm"
                      step="0.1"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={tier.price.toFixed(2)}
                      onChange={e => updateTier(i, 'price', parseFloat(e.target.value))}
                      className="flex-1 p-2 border rounded text-sm"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded flex items-center gap-1">
                  <Save size={16} /> {editingId ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-5 py-2 rounded flex items-center gap-1">
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 object-cover rounded" />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.brand} • {p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.mrp)}</td>
                  <td className="px-4 py-3 text-xs">
                    {p.pricingTiers.map(t => (
                      <div key={t.range}>{t.range}: {formatPrice(t.price)}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      p.stock < 20 ? 'bg-red-100 text-red-700' :
                      p.stock < 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => startEdit(p)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;