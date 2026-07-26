import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import ProductForm from './pages/ProductForm.jsx';
import Search from './pages/Search.jsx';
import { LayoutDashboard, Package, Search as SearchIcon, Plus } from 'lucide-react';

export default function App() {
  const { pathname } = useLocation();

  const nav = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/search', icon: SearchIcon, label: 'AI Search' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">✈️ TravelPM</h1>
          <p className="text-xs text-gray-400 mt-0.5">Product Manager</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <Link
            to="/products/new"
            className="flex items-center gap-2 w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
    </div>
  );
}