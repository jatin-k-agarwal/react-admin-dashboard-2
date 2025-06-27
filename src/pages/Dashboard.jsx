import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { name: 'Mon', tasks: 3 },
  { name: 'Tue', tasks: 5 },
  { name: 'Wed', tasks: 2 },
  { name: 'Thu', tasks: 6 },
  { name: 'Fri', tasks: 4 },
  { name: 'Sat', tasks: 7 },
  { name: 'Sun', tasks: 1 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">📊 Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500">Total Tasks</h2>
            <p className="text-2xl font-bold text-blue-600">32</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500">Completed</h2>
            <p className="text-2xl font-bold text-green-500">20</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500">Pending</h2>
            <p className="text-2xl font-bold text-yellow-500">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500">Revenue</h2>
            <p className="text-2xl font-bold text-purple-600">₹45,000</p>
          </div>
        </div>

        {/* Tasks Overview Line Chart */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            📈 Weekly Task Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#3B82F6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
