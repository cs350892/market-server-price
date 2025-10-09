import React from 'react';
import { mockOrders } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const today = '2025-10-08';
  const todaysOrders = mockOrders.filter(order => order.date === today);
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;

  // Last 7 days sales data
  const salesData = [
    { date: '2025-10-02', sales: 120 },
    { date: '2025-10-03', sales: 150 },
    { date: '2025-10-04', sales: 100 },
    { date: '2025-10-05', sales: 200 },
    { date: '2025-10-06', sales: 180 },
    { date: '2025-10-07', sales: 90 },
    { date: '2025-10-08', sales: 94.50 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Today's Sales</h3>
          <p className="text-2xl">₹{todaysOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl">{totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Pending Orders</h3>
          <p className="text-2xl">{pendingOrders}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Last 7 Days Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;