import React, { useState } from 'react';
import { mockOffers, mockProducts } from '../data/mockData';

const OffersCoupons = () => {
  const [offers, setOffers] = useState(mockOffers);
  const [newOffer, setNewOffer] = useState({
    code: '',
    discount: '',
    products: [],
    expiry: '',
  });

  const handleAddOffer = (e) => {
    e.preventDefault();
    setOffers([...offers, {
      id: String(offers.length + 1),
      ...newOffer,
      status: new Date(newOffer.expiry) > new Date() ? 'active' : 'expired',
    }]);
    setNewOffer({ code: '', discount: '', products: [], expiry: '' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Offers & Coupons</h2>
      <form onSubmit={handleAddOffer} className="bg-white p-4 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">Create New Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Coupon Code"
            value={newOffer.code}
            onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Discount (%)"
            value={newOffer.discount}
            onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newOffer.expiry}
            onChange={(e) => setNewOffer({ ...newOffer, expiry: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            multiple
            value={newOffer.products}
            onChange={(e) => setNewOffer({
              ...newOffer,
              products: Array.from(e.target.selectedOptions, option => option.value),
            })}
            className="p-2 border rounded"
          >
            {mockProducts.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Offer
        </button>
      </form>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Active Offers</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Code</th>
              <th>Discount</th>
              <th>Products</th>
              <th>Status</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.id}>
                <td>{offer.code}</td>
                <td>{offer.discount}%</td>
                <td>{offer.products.map(id => mockProducts.find(p => p.id === id)?.name).join(', ')}</td>
                <td>{offer.status}</td>
                <td>{offer.expiry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OffersCoupons;