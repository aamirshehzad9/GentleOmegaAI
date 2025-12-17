/**
 * SiteDetail.tsx - Site detail modal with metadata and actions
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SiteData {
  id: string;
  url: string;
  title: string;
  h1: string | null;
  meta_description: string | null;
  first_paragraph: string | null;
  emails: string[];
  links_sample: string[];
  links_count: number;
  spam_score: number;
  backlink_value: number;
  domain_authority: number;
  category: string;
  language: string;
  summary: string | null;
  sentiment: string;
  guest_post_detected: boolean;
  status: string;
  created_at: string;
}

const API_BASE = import.meta.env.VITE_GOB_API_URL || 'https://us-central1-gentleomegaai.cloudfunctions.net/gobApi';

interface SiteDetailProps {
  siteId: string;
  onClose: () => void;
}

const SiteDetail: React.FC<SiteDetailProps> = ({ siteId, onClose }) => {
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gob/${siteId}`);
        if (!res.ok) throw new Error('Failed to fetch site');
        const data = await res.json();
        setSite(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [siteId]);

  const copyToClipboard = (text: string, email: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-white">Loading site details...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !site) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-gray-800 rounded-xl p-8 max-w-md">
          <p className="text-red-400 mb-4">❌ {error || 'Site not found'}</p>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  const sentimentColor: Record<string, string> = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full my-8"
      >
        {/* Header */}
        <div className="bg-gray-900 p-6 border-b border-gray-700 flex items-start justify-between sticky top-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{site.title}</h2>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-sm break-all"
            >
              {site.url}
            </a>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl ml-4 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Spam Score" value={(site.spam_score || 0).toFixed(1)} unit="/100" />
            <MetricCard label="Backlink Value" value={`$${(site.backlink_value || 0).toFixed(2)}`} />
            <MetricCard label="Domain Authority" value={(site.domain_authority || 0).toFixed(1)} unit="/100" />
            <MetricCard label="Links Found" value={(site.links_count || 0).toString()} />
          </div>

          {/* Content Section */}
          {(site.h1 || site.meta_description || site.first_paragraph) && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">📝 Content</h3>
              {site.h1 && (
                <div className="mb-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">H1</p>
                  <p className="text-white">{site.h1}</p>
                </div>
              )}
              {site.meta_description && (
                <div className="mb-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Meta Description</p>
                  <p className="text-gray-300 text-sm">{site.meta_description}</p>
                </div>
              )}
              {site.first_paragraph && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">First Paragraph</p>
                  <p className="text-gray-300 text-sm line-clamp-3">{site.first_paragraph}</p>
                </div>
              )}
            </div>
          )}

          {/* Emails */}
          {site.emails.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">✉️ Contact Emails ({site.emails.length})</h3>
              <div className="space-y-2">
                {site.emails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between bg-gray-600 px-3 py-2 rounded hover:bg-gray-600/80 transition-colors"
                  >
                    <span className="text-gray-300 font-mono text-sm">{email}</span>
                    <button
                      onClick={() => copyToClipboard(email, email)}
                      className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      {copiedEmail === email ? '✓ Copied' : '📋'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {site.links_sample.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">
                🔗 Sample Links (showing {site.links_sample.length} of {site.links_count})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {site.links_sample.slice(0, 10).map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-cyan-400 hover:text-cyan-300 text-sm truncate hover:underline"
                    title={link}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* AI Enrichment */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">🤖 AI Insights</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm mb-1">Category</p>
                <p className="text-white font-semibold">{site.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Language</p>
                  <p className="text-white">{site.language}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Sentiment</p>
                  <p className={`font-semibold ${sentimentColor[site.sentiment.toLowerCase()] || 'text-gray-300'}`}>
                    {site.sentiment}
                  </p>
                </div>
              </div>
              {site.summary && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Summary</p>
                  <p className="text-gray-300 text-sm line-clamp-4">{site.summary}</p>
                </div>
              )}
              {site.guest_post_detected && (
                <div className="bg-green-500/20 border border-green-500 rounded px-3 py-2">
                  <p className="text-green-300 text-sm">✍️ Guest post opportunity detected!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-900 p-6 border-t border-gray-700 flex gap-3 sticky bottom-0">
          <button
            onClick={() => window.location.href = `/go-aibob/buy/${site.id}`}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            💰 Buy Backlink
          </button>
          <button
            onClick={() => alert('Rescrape feature coming soon')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            🔄 Rescrape
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; unit?: string }> = ({ label, value, unit }) => (
  <div className="bg-gray-700 rounded-lg p-3 text-center">
    <p className="text-gray-400 text-xs uppercase mb-1">{label}</p>
    <p className="text-white text-lg font-bold">
      {value}
      {unit && <span className="text-sm text-gray-400">{unit}</span>}
    </p>
  </div>
);

export default SiteDetail;
