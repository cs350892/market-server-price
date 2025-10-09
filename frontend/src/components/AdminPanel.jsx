import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react';
import { formatPrice, formatMargin } from '../utils/pricing';

const AdminPanel = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  const defaultPricingTiers = [
    { range: '1-20', minQuantity: 1, maxQuantity: 20, price: 0, margin: 37 },
    { range: '21-100', minQuantity: 21, maxQuantity: 100, price: 0, margin: 45 },
    { range: '100+', minQuantity: 101, maxQuantity: null, price: 0, margin: 55 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct, formData);
      setEditingProduct(null);
    } else {
      onAddProduct({
        ...formData,
        pricingTiers: formData.pricingTiers || defaultPricingTiers,
      });
      setShowAddForm(false);
    }
    setFormData({});
  };

  const calculatePriceFromMargin = (mrp, margin) => {
    return mrp * (1 - margin / 100);
  };

  const updatePricingTier = (index, field, value) => {
    const updatedTiers = [...(formData.pricingTiers || defaultPricingTiers)];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    
    // Auto-calculate price if margin is updated
    if (field === 'margin' && formData.mrp) {
      updatedTiers[index].price = calculatePriceFromMargin(formData.mrp, value);
    }
    
    setFormData({ ...formData, pricingTiers: updatedTiers });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel - Product Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {(showAddForm || editingProduct) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="MRP"
                  value={formData.mrp || ''}
                  onChange={(e) => {
                    const mrp = parseFloat(e.target.value);
                    setFormData({ ...formData, mrp });
                    // Auto-update pricing tiers when MRP changes
                    if (formData.pricingTiers) {
                      const updatedTiers = formData.pricingTiers.map(tier => ({
                        ...tier,
                        price: calculatePriceFromMargin(mrp, tier.margin)
                      }));
                      setFormData({ ...formData, mrp, pricingTiers: updatedTiers });
                    }
                  }}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Brand"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <textarea
                placeholder="Product Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />

              {/* Pricing Tiers */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Pricing Tiers</h3>
                <div className="space-y-3">
                  {(formData.pricingTiers || defaultPricingTiers).map((tier, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {tier.customerType}
                        </label>
                        <input
                          type="text"
                          value={tier.range}
                          readOnly
                          className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Margin %
                        </label>
                        <input
                          type="number"
                          value={tier.margin}
                          onChange={(e) => updatePricingTier(index, 'margin', parseFloat(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          value={tier.price.toFixed(2)}
                          onChange={(e) => updatePricingTier(index, 'price', parseFloat(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-end">
                        <span className="text-sm text-gray-600">
                          {formData.mrp ? `${((1 - tier.price / formData.mrp) * 100).toFixed(1)}% off MRP` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setFormData({});
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MRP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing Tiers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand} • {product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(product.mrp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        {product.pricingTiers.map((tier, index) => (
                          <div key={index} className="text-xs">
                            <span className="font-medium">{tier.customerType}:</span> {formatPrice(tier.price)} ({formatMargin(tier.margin)})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock < 20 
                          ? 'bg-red-100 text-red-800' 
                          : product.stock < 50 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product.id);
                            setFormData(product);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;