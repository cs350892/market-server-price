import React from 'react';
import { mockPayouts, mockOrders } from '../data/mockData';
import { Download } from 'lucide-react';

const PaymentsReports = () => {
  const handleDownloadReport = () => {
    const csvContent = [
      'Invoice ID,Customer,Date,Total,Status',
      ...mockOrders.map(order =>
        `${order.invoiceId},${order.customer},${order.date},${order.total},${order.status}`
      ),
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
            {mockPayouts.map(payout => (
              <tr key={payout.id}>
                <td>{payout.date}</td>
                <td>₹{payout.amount.toFixed(2)}</td>
                <td>{payout.status}</td>
                <td>{payout.orders.join(', ')}</td>
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