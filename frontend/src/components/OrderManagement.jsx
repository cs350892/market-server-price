import React, { useState } from 'react';
import { mockOrders } from '../data/mockData';

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusUpdate = (id, newStatus) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Invoice ${order.invoiceId}</title></head>
        <body>
          <h1>Invoice ${order.invoiceId}</h1>
          <p>Customer: ${order.customer}</p>
          <p>Date: ${order.date}</p>
          <h2>Products</h2>
          <ul>
            ${order.products.map(p => `<li>${p.name} - ${p.quantity} x ₹${p.price} = ₹${(p.quantity * p.price).toFixed(2)}</li>`).join('')}
          </ul>
          <p>Total: ₹${order.total.toFixed(2)}</p>
          <p>Status: ${order.status}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order Management</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.invoiceId}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>₹{order.total.toFixed(2)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handlePrintInvoice(order)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Print Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;