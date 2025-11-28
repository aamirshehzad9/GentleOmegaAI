/**
 * BuyBacklinkForm.tsx - Purchase backlink form with pricing calculator
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BuyFormData {
  site_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  target_url: string;
  keywords: string[];
  content_type: 'article' | 'review' | 'infographic' | 'other';
  notes: string;
}

const API_BASE = process.env.VITE_GOB_API_URL || 'http://localhost:3001';

interface BuyBacklinkFormProps {
  siteId?: string;
}

const BuyBacklinkForm: React.FC<BuyBacklinkFormProps> = ({ siteId }) => {
  const [form, setForm] = useState<BuyFormData>({
    site_id: siteId || '',
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    target_url: '',
    keywords: [],
    content_type: 'article',
    notes: ''
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [siteData, setSiteData] = useState<any>(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch site data if siteId provided
  useEffect(() => {
    if (form.site_id) {
      const fetchSite = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/gob/${form.site_id}`);
          if (res.ok) {
            const data = await res.json();
            setSiteData(data);
            // Calculate base price
            calculatePrice(data.backlink_value);
          }
        } catch (err) {
          console.error('Failed to fetch site:', err);
        }
      };
      fetchSite();
    }
  }, [form.site_id]);

  // Calculate price based on content type
  const calculatePrice = (basePrice: number) => {
    const multipliers: Record<string, number> = {
      article: 1.0,
      review: 1.2,
      infographic: 1.5,
      other: 0.8
    };

    const multiplier = multipliers[form.content_type] || 1.0;
    const finalPrice = basePrice * multiplier * (1 + form.keywords.length * 0.1);
    setEstimatedPrice(finalPrice);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && form.keywords.length < 10) {
      setForm({
        ...form,
        keywords: [...form.keywords, newKeyword.trim()]
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (idx: number) => {
    setForm({
      ...form,
      keywords: form.keywords.filter((_, i) => i !== idx)
    });
  };

  const handleContentTypeChange = (type: string) => {
    const newForm = { ...form, content_type: type as any };
    setForm(newForm);
    if (siteData) calculatePrice(siteData.backlink_value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.site_id || !form.buyer_name || !form.buyer_email || !form.target_url || form.keywords.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/gob/buy-backlink`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: estimatedPrice
        })
      });

      if (!res.ok) throw new Error('Failed to create order');

      const data = await res.json();
      setOrderResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Order Created Successfully!</h2>

            <div className="bg-gray-700 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Invoice ID</p>
                  <p className="text-white font-mono font-semibold">{orderResult.invoice_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Price</p>
                  <p className="text-green-400 font-bold text-lg">${orderResult.price?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Target URL</p>
                  <p className="text-cyan-400 text-sm truncate">{orderResult.target_url}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Keywords</p>
                  <p className="text-white text-sm">{orderResult.keywords?.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-6">
              <p className="text-blue-300">
                💡 Your order is queued for processing. We'll reach out to the site owner and keep you updated.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = '/go-aibob/orders'}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                📋 View Orders
              </button>
              <button
                onClick={() => {
                  setOrderResult(null);
                  setForm({
                    site_id: '',
                    buyer_name: '',
                    buyer_email: '',
                    buyer_phone: '',
                    target_url: '',
                    keywords: [],
                    content_type: 'article',
                    notes: ''
                  });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ➕ New Order
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">💰 Purchase Backlink</h1>
          <p className="text-gray-400">Get guest post opportunities on high-quality sites</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-xl p-6 space-y-6"
        >
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400">❌ {error}</p>
            </div>
          )}

          {/* Site Selection */}
          <div>
            <label className="block text-white font-semibold mb-2">Select Site *</label>
            <input
              type="text"
              placeholder="Site ID or URL"
              value={form.site_id}
              onChange={(e) => {
                setForm({ ...form, site_id: e.target.value });
                setSiteData(null);
              }}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-cyan-500 outline-none"
            />
            {siteData && (
              <div className="mt-2 bg-gray-700 p-3 rounded text-sm">
                <p className="text-cyan-400">{siteData.url}</p>
                <p className="text-gray-400">Base Price: <span className="text-green-400 font-semibold">${siteData.backlink_value.toFixed(2)}</span></p>
              </div>
            )}
          </div>

          {/* Buyer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={form.buyer_name}
                onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Email *</label>
              <input
                type="email"
                required
                value={form.buyer_email}
                onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              value={form.buyer_phone}
              onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Content Details */}
          <div>
            <label className="block text-white font-semibold mb-2">Target URL *</label>
            <input
              type="url"
              required
              placeholder="https://yoursite.com/page"
              value={form.target_url}
              onChange={(e) => setForm({ ...form, target_url: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-white font-semibold mb-2">Keywords * (max 10)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a keyword..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-cyan-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.keywords.map((kw, idx) => (
                <div
                  key={idx}
                  className="bg-cyan-600/20 border border-cyan-500 text-cyan-300 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(idx)}
                    className="text-cyan-300 hover:text-cyan-100 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-white font-semibold mb-2">Content Type *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['article', 'review', 'infographic', 'other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleContentTypeChange(type)}
                  className={`px-4 py-2 rounded font-semibold transition-colors capitalize ${
                    form.content_type === type
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type === 'article' && '📄'}
                  {type === 'review' && '⭐'}
                  {type === 'infographic' && '📊'}
                  {type === 'other' && '❓'}
                  {' '}{type}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white font-semibold mb-2">Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any special requirements or preferences..."
              rows={4}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-cyan-500 outline-none resize-none"
            />
          </div>

          {/* Price Estimate */}
          {estimatedPrice > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/10 border border-green-500 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-semibold">Estimated Total Price</span>
                <span className="text-3xl font-bold text-green-400">${estimatedPrice.toFixed(2)}</span>
              </div>
              <p className="text-green-300 text-xs mt-2">
                💡 Price includes base rate + keyword multipliers + content type adjustment
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !siteData}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {submitting ? '⏳ Processing...' : '✓ Create Order'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default BuyBacklinkForm;
