import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar, 
  Tag, 
  Users, 
  DollarSign,
  X,
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Package
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const OfferManagementDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageDetails, setUsageDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    discountType: 'percentage',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    expiry: '',
    usageLimit: '',
    status: 'active',
    products: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all products using React Query
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/v1/products/`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = productsData?.products || [];

  // Get auth token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch offers
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/offers/all?page=${currentPage}&status=${statusFilter !== 'all' ? statusFilter : ''}`,
        getAuthHeaders()
      );
      setOffers(response.data.offers);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch offers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/offers/stats`,
        getAuthHeaders()
      );
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchStats();
  }, [currentPage, statusFilter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle product selection
  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Select all products
  const handleSelectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  // Clear product selection
  const handleClearProducts = () => {
    setSelectedProducts([]);
  };

  // Create or Update offer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const submitData = {
        ...formData,
        products: selectedProducts
      };

      if (modalMode === 'create') {
        await axios.post(
          `${API_BASE_URL}/offers/create`,
          submitData,
          getAuthHeaders()
        );
        setSuccess('Offer created successfully!');
      } else {
        await axios.put(
          `${API_BASE_URL}/offers/${selectedOffer._id}`,
          submitData,
          getAuthHeaders()
        );
        setSuccess('Offer updated successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchOffers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  // Delete offer
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/offers/${id}`,
        getAuthHeaders()
      );
      setSuccess('Offer deleted successfully!');
      fetchOffers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  // View usage details
  const handleViewUsage = async (offer) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/offers/${offer._id}/usage`,
        getAuthHeaders()
      );
      setUsageDetails(response.data);
      setShowUsageModal(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch usage details';
      setError(errorMsg);
    }
  };

  // Open edit modal
  const handleEdit = (offer) => {
    setSelectedOffer(offer);
    setModalMode('edit');
    setFormData({
      code: offer.code,
      description: offer.description,
      discount: offer.discount,
      discountType: offer.discountType,
      minPurchaseAmount: offer.minPurchaseAmount || '',
      maxDiscountAmount: offer.maxDiscountAmount || '',
      expiry: offer.expiry.split('T')[0],
      usageLimit: offer.usageLimit || '',
      status: offer.status
    });
    setSelectedProducts(offer.products?.map(p => p._id) || []);
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount: '',
      discountType: 'percentage',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      expiry: '',
      usageLimit: '',
      status: 'active'
    });
    setSelectedProducts([]);
    setProductSearchTerm('');
    setSelectedOffer(null);
    setModalMode('create');
  };

  // Filter offers by search term
  const filteredOffers = offers.filter(offer =>
    offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Offer Management</h1>
          <p className="text-gray-600">Manage promotional offers and discounts</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Tag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Active Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeOffers}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Expired Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiredOffers}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Discount Given</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalDiscountGiven.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filter and Create */}
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>

                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Create Offer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="p-12 text-center">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No offers found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOffers.map((offer) => (
                      <tr key={offer._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-mono font-semibold text-sm">
                              {offer.code}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {offer.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {offer.discountType === 'percentage' 
                              ? `${offer.discount}%` 
                              : `₹${offer.discount}`}
                          </div>
                          {offer.maxDiscountAmount && (
                            <div className="text-xs text-gray-500">
                              Max: ₹{offer.maxDiscountAmount}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {offer.products && offer.products.length > 0 ? (
                              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                <Package className="w-3 h-3" />
                                {offer.products.length} products
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs">All products</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {offer.usageCount} / {offer.usageLimit || '∞'}
                          </div>
                          {offer.usageLimit && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${(offer.usageCount / offer.usageLimit) * 100}%` }}
                              ></div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                            {getStatusIcon(offer.status)}
                            {offer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(offer.expiry).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewUsage(offer)}
                              className="text-purple-600 hover:text-purple-900 p-1"
                              title="View Usage"
                            >
                              <BarChart3 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(offer)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(offer._id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Create New Offer' : 'Edit Offer'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                      placeholder="SUMMER2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Get 20% off on all products"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Purchase Amount
                    </label>
                    <input
                      type="number"
                      name="minPurchaseAmount"
                      value={formData.minPurchaseAmount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Discount Amount
                    </label>
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      value={formData.maxDiscountAmount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                {/* Product Selection */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Applicable Products (Optional)
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty for all products, or select specific products
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {selectedProducts.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearProducts}
                          className="text-sm text-red-600 hover:text-red-700 px-3 py-1 border border-red-300 rounded-lg"
                        >
                          Clear ({selectedProducts.length})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSelectAllProducts}
                        className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-300 rounded-lg"
                      >
                        {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                  </div>

                  {/* Product Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products by name or category..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Products List */}
                  {productsLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-sm text-gray-600">Loading products...</p>
                    </div>
                  ) : productsError ? (
                    <div className="text-center py-8 text-red-600">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Failed to load products</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No products found</p>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <label
                          key={product._id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleProductToggle(product._id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">₹{product.price}</p>
                                {product.mrp && product.mrp !== product.price && (
                                  <p className="text-xs text-gray-500 line-through">₹{product.mrp}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {selectedProducts.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>{selectedProducts.length}</strong> product(s) selected. This offer will only apply to these products.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {modalMode === 'create' ? 'Create Offer' : 'Update Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Usage Details Modal */}
        {showUsageModal && usageDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Usage Details</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Code: <span className="font-mono font-semibold">{usageDetails.offer.code}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUsageModal(false);
                    setUsageDetails(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-blue-900">{usageDetails.totalUsers}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-green-900">{usageDetails.statistics.totalOrders}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Total Discount</p>
                    <p className="text-2xl font-bold text-purple-900">₹{usageDetails.statistics.totalDiscount}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-orange-900">₹{usageDetails.statistics.totalRevenue}</p>
                  </div>
                </div>

                {/* User Usage Table */}
                {usageDetails.usageDetails.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Usage Count</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Discount</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Order Value</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Discount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {usageDetails.usageDetails.map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{user.userName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{user.userEmail}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">{user.usageCount}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{user.totalDiscount.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{user.totalOrderValue.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{user.averageDiscount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 border border-gray-200 rounded-lg">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No usage data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Most Used Offers Section */}
        {stats && stats.mostUsedOffers && stats.mostUsedOffers.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Most Used Offers
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.mostUsedOffers.map((offer, index) => (
                  <div key={offer._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono font-semibold">
                        {offer.code}
                      </div>
                      <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        #{index + 1}
                      </div>
                    </div>
                    <p className="text-sm text-gray-900 mb-3 line-clamp-2">{offer.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Used:</span>
                      <span className="font-semibold text-gray-900">
                        {offer.usageCount} / {offer.usageLimit || '∞'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-green-600">
                        {offer.discountType === 'percentage' ? `${offer.discount}%` : `₹${offer.discount}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferManagementDashboard;

/**
 * TODO: First fetch offers and statistics from the backend API.And all products details only with product id,name,price,category.
 * Then display them in a table format with options to create, edit, delete offers.
 * Also provide a way to view usage details of each offer.
 * OfferManagementDashboard component
 *
 *
 * This component is responsible for managing the offer creation, updating, and deletion processes.
 * It provides a user interface for viewing and managing offers, including their usage statistics.
 *
 * The component first fetches offers and statistics data from the backend API.
 * It displays the offers in a table format with options to create, edit, delete, and view usage details of each offer.
 * The component maintains state for offers, statistics, loading status, modal visibility, form data, search term, status filter, pagination, and messages.
 */