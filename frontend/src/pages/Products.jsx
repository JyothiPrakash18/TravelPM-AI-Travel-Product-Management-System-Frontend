import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api.jsx';
import { Pencil, Trash2 } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);

  const load = () => getProducts().then(r => setProducts(r.data));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  const statusColor = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-gray-100 text-gray-600',
  };

  return (
    // ✅ p-4 sm:p-8 — tighter padding on mobile
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Products</h2>
      <Link to="/products/new"
        className="self-start sm:self-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap">
        + New Product
      </Link>
      </div>

      {/* ✅ Table scrolls horizontally on mobile */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Destination', 'Category', 'Price', 'Valid Until', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No products yet. Add one!</td></tr>
            )}
            {products.map(p => (
              <tr key={p.product_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{p.product_name}</td>
                <td className="px-4 py-3 text-gray-600">{p.destination}</td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 text-gray-900 whitespace-nowrap">LKR {Number(p.price).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(p.valid_until).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[p.status] || 'bg-gray-100 text-gray-600'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/products/${p.product_id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => handleDelete(p.product_id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
