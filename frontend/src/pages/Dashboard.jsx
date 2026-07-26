import React, { useEffect, useState } from 'react';
import { getDashboard } from '../api.jsx';
import { Package, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboard().then(r => setStats(r.data));
  }, []);

  const cards = [
    { label: 'Total Products', key: 'total', icon: Package, color: 'blue' },
    { label: 'Active Products', key: 'active', icon: CheckCircle, color: 'green' },
    { label: 'Expired Products', key: 'expired', icon: Clock, color: 'red' },
  ];

  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map(({ label, key, icon: Icon, color }) => (
          <div key={key} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-4`}>
              <Icon size={20} />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats ? stats[key] : '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
