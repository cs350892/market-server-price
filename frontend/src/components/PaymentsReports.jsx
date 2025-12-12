import React, { useEffect, useState, useContext } from 'react';
import { Download } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const PaymentsReports = () => {
  const { apiFetch } = useContext(AuthContext);
  const [payouts, setPayouts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await apiFetch('/admin/payouts');
        setPayouts(p.payouts || []);
        const o = await apiFetch('/admin/orders');
        setOrders(o.orders || []);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [apiFetch]);

  const handleDownloadReport = () => {
    const csvContent = [
      'Invoice ID,Customer,Date,Total,Status',
      ...orders.map(order => {
        const id = order.invoiceId || order._id || '';
        const customer = order.user?.name || order.customer || '';
        const date = order.createdAt || order.date || '';
        const total = order.totalAmount || order.total || 0;
        const status = order.status || '';
        return `${id},${customer},${date},${total},${status}`;
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payments & Reports</h2>
      {error && <div className="text-red-600">{error}</div>}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Payout History</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(payout => (
              <tr key={payout._id || payout.id}>
                <td>{new Date(payout.date).toLocaleDateString()}</td>
                <td>₹{Number(payout.amount || 0).toFixed(2)}</td>
                <td>{payout.status}</td>
                <td>{(payout.orders || []).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleDownloadReport}
          className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Download size={20} />
          <span>Download Sales Report</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentsReports;