import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct, generateProduct } from '../api.jsx';
import { Sparkles, Loader2 } from 'lucide-react';

const empty = {
  product_name: '', destination: '', category: '', description: '',
  price: '', inventory_count: '', valid_from: '', valid_until: '',
  status: 'Active', highlights: [], inclusions: [], tags: [],
};

const CATEGORIES = ['Dining', 'Transfer', 'Adventure', 'Sightseeing', 'Accommodation', 'Package'];

// ✅ FIX 1: Moved OUTSIDE the component to prevent re-mount on every render
const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // ✅ FIX 2: Separate draft state for array text fields
  const [drafts, setDrafts] = useState({
    highlights: '',
    inclusions: '',
    tags: '',
  });

  useEffect(() => {
    if (id) {
      getProduct(id).then(r => {
        const p = r.data;
        const highlights = p.highlights || [];
        const inclusions = p.inclusions || [];
        const tags = p.tags || [];
        setForm({
          ...p,
          valid_from: p.valid_from?.split('T')[0] || '',
          valid_until: p.valid_until?.split('T')[0] || '',
          highlights,
          inclusions,
          tags,
        });
        // ✅ Sync drafts with loaded data
        setDrafts({
          highlights: highlights.join('\n'),
          inclusions: inclusions.join('\n'),
          tags: tags.join(', '),
        });
      });
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const r = await generateProduct(aiPrompt);
      const d = r.data;
      const highlights = d.highlights || [];
      const inclusions = d.inclusions || [];
      const tags = d.tags || [];
      setForm(f => ({
        ...f,
        product_name: d.product_name || f.product_name,
        description: d.description || f.description,
        category: d.category || f.category,
        highlights,
        inclusions,
        tags,
      }));
      // ✅ Sync drafts after AI generation
      setDrafts({
        highlights: highlights.join('\n'),
        inclusions: inclusions.join('\n'),
        tags: tags.join(', '),
      });
    } catch (e) {
      alert('AI generation failed: ' + e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) await updateProduct(id, form);
      else await createProduct(form);
      navigate('/products');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="p-8 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{id ? 'Edit Product' : 'New Product'}</h2>

      {/* AI Generator */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-1.5">
          <Sparkles size={14} /> AI Product Generator
        </p>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="e.g. Create a dinner buffet at Cinnamon Grand Colombo available until end of month"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAI()}
          />
          <button
            type="button"
            onClick={handleAI}
            disabled={aiLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Generate
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product Name *">
            <input required className={inputCls} value={form.product_name} onChange={e => set('product_name', e.target.value)} />
          </Field>
          <Field label="Destination *">
            <input required className={inputCls} value={form.destination} onChange={e => set('destination', e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category *">
            <select required className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </Field>
        </div>

        <Field label="Description *">
          <textarea required rows={3} className={inputCls} value={form.description} onChange={e => set('description', e.target.value)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (LKR) *">
            <input required type="number" min="0" className={inputCls} value={form.price} onChange={e => set('price', e.target.value)} />
          </Field>
          <Field label="Inventory Count *">
            <input required type="number" min="0" className={inputCls} value={form.inventory_count} onChange={e => set('inventory_count', e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Valid From *">
            <input required type="date" className={inputCls} value={form.valid_from} onChange={e => set('valid_from', e.target.value)} />
          </Field>
          <Field label="Valid Until *">
            <input required type="date" className={inputCls} value={form.valid_until} onChange={e => set('valid_until', e.target.value)} />
          </Field>
        </div>

        {/* ✅ FIX 2: Use draft state for typing, sync to form array on blur */}
        <Field label="Highlights (one per line)">
          <textarea rows={2} className={inputCls}
            value={drafts.highlights}
            onChange={e => setDrafts(d => ({ ...d, highlights: e.target.value }))}
            onBlur={e => set('highlights', e.target.value.split('\n').filter(Boolean))}
            placeholder="Free welcome drink&#10;Ocean view seating" />
        </Field>

        <Field label="Inclusions (one per line)">
          <textarea rows={2} className={inputCls}
            value={drafts.inclusions}
            onChange={e => setDrafts(d => ({ ...d, inclusions: e.target.value }))}
            onBlur={e => set('inclusions', e.target.value.split('\n').filter(Boolean))}
            placeholder="Buffet dinner&#10;1 glass of wine" />
        </Field>

        <Field label="Tags (comma-separated)">
          <input className={inputCls}
            value={drafts.tags}
            onChange={e => setDrafts(d => ({ ...d, tags: e.target.value }))}
            onBlur={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            placeholder="dinner, buffet, colombo" />
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {id ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/products')}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}