import React, { useState } from 'react';
import { searchProducts } from '../api.jsx';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

const EXAMPLES = [
  'Show me dinner buffets in Colombo',
  'Show active family packages',
  'Show products below LKR 10,000',
  'Show airport transfer services',
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const r = await searchProducts(q);
      setResults(r.data);
    } catch (e) {
      alert('Search failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ p-4 sm:p-8, w-full so it fills the mobile viewport
    <div className="p-4 sm:p-8 max-w-3xl w-full">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">AI Search</h2>
      <p className="text-sm text-gray-500 mb-6">Search products using natural language</p>

      {/* Search bar — already flex, stays row on all sizes, just needs whitespace-nowrap on button */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Show dinner buffets in Colombo"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
          />
        </div>
        {/* ✅ whitespace-nowrap prevents "Search" from wrapping on narrow screens */}
        <button onClick={() => run()} disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <SearchIcon size={14} />}
          Search
        </button>
      </div>

      {/* ✅ Example pills already flex-wrap — no changes needed */}
      <div className="flex flex-wrap gap-2 mb-6">
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => { setQuery(ex); run(ex); }}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors">
            {ex}
          </button>
        ))}
      </div>

      {results !== null && (
        <div>
          <p className="text-sm text-gray-500 mb-3">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
          {results.length === 0 && (
            <div className="text-center py-10 text-gray-400">No matching products found.</div>
          )}
          <div className="space-y-3">
            {results.map(p => (
              <div key={p.product_id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {/* ✅ truncate prevents long names overflowing on mobile */}
                    <h3 className="font-semibold text-gray-900 truncate">{p.product_name}</h3>
                    <p className="text-sm text-gray-500">{p.destination} · {p.category}</p>
                  </div>
                  {/* ✅ shrink-0 keeps price from being squeezed */}
                  <p className="text-sm font-semibold text-blue-700 shrink-0">LKR {Number(p.price).toLocaleString()}</p>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
