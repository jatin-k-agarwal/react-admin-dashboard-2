import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import dayjs from 'dayjs';

const STATUS_COLORS = {
  'To Do': '#3B82F6',
  'In Progress': '#F59E0B',
  'Testing': '#10B981',
  'Done': '#6366F1',
};

const PRIORITY_COLORS = {
  High: '#EF4444',
  Medium: '#FBBF24',
  Low: '#22C55E',
};

const Charts = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('kanban-tasks')) || [];
    const now = dayjs();

    const filtered = allTasks.filter((task) => {
      const created = dayjs(task.createdAt);
      if (filter === 'today') return created.isSame(now, 'day');
      if (filter === 'week') return created.isAfter(now.subtract(7, 'day'));
      return true;
    });

    setTasks(filtered);
  }, [filter]);

  const countByField = (field) => {
    const map = {};
    for (let task of tasks) {
      map[task[field]] = (map[task[field]] || 0) + 1;
    }
    return Object.entries(map).map(([key, value]) => ({ name: key, value }));
  };

  const byStatus = countByField('status');
  const byPriority = countByField('priority');
  const completedStats = [
    { name: 'Done', value: tasks.filter(t => t.status === 'Done').length },
    { name: 'Not Done', value: tasks.filter(t => t.status !== 'Done').length },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📊 Analytics Dashboard</h1>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3">
        {['all', 'today', 'week'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded text-white ${
              filter === type ? 'bg-blue-600' : 'bg-gray-500'
            } hover:opacity-90`}
          >
            {type === 'all' ? 'All Time' : type === 'today' ? 'Today' : 'This Week'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-4 text-center">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byStatus}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {byStatus.map((entry, index) => (
                  <Cell key={index} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-4 text-center">Tasks by Priority</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={byPriority}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {byPriority.map((entry, index) => (
                  <Cell key={index} fill={PRIORITY_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completed vs Pending */}
        <div className="bg-white p-4 shadow rounded col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-center">Completion Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completedStats}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
