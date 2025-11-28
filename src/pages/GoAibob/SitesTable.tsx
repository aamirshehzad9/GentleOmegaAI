/**
 * SitesTable.tsx - Sites management interface
 * Features: filtering, sorting, bulk actions, pagination
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Site {
  id: string;
  url: string;
  title: string;
  status: 'new' | 'scraping' | 'scraped' | 'enriched' | 'error';
  emails_found: number;
  spam_score: number;
  backlink_value: number;
  guest_post_detected: boolean;
  created_at: string;
}

const API_BASE = process.env.VITE_GOB_API_URL || 'http://localhost:3001';

const SitesTable: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    minBacklinkValue: 0,
    maxSpamScore: 100,
    hasEmail: 'all',
    guestPostOnly: false,
    search: ''
  });

  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch sites
  const fetchSites = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
        search: filters.search,
        guest_post_only: filters.guestPostOnly ? '1' : '0',
        min_backlink_value: filters.minBacklinkValue.toString(),
        max_spam_score: filters.maxSpamScore.toString()
      });

      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.hasEmail !== 'all') params.append('has_email', filters.hasEmail);

      const res = await fetch(`${API_BASE}/api/gob/list?${params}`);
      if (!res.ok) throw new Error('Failed to fetch sites');

      const data = await res.json();
      setSites(data.sites || []);
      setTotalCount(data.total_count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [page, pageSize, filters, sortBy, sortOrder]);

  const handleToggleSite = (id: string) => {
    const newSelected = new Set(selectedSites);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSites(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedSites.size === sites.length) {
      setSelectedSites(new Set());
    } else {
      setSelectedSites(new Set(sites.map(s => s.id)));
    }
  };

  const statusColor: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-300',
    scraping: 'bg-yellow-500/20 text-yellow-300',
    scraped: 'bg-green-500/20 text-green-300',
    enriched: 'bg-purple-500/20 text-purple-300',
    error: 'bg-red-500/20 text-red-300'
  };

  const statusIcon: Record<string, string> = {
    new: '📋',
    scraping: '⚙️',
    scraped: '✅',
    enriched: '🤖',
    error: '❌'
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-6">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={fetchSites}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">📊 Scraping Sites</h1>

          {/* Filters */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">🔍 Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search URL..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-cyan-500 outline-none"
              />

              {/* Status */}
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPage(1);
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="scraping">Scraping</option>
                <option value="scraped">Scraped</option>
                <option value="enriched">Enriched</option>
                <option value="error">Error</option>
              </select>

              {/* Backlink Value Range */}
              <input
                type="range"
                min="0"
                max="500"
                value={filters.minBacklinkValue}
                onChange={(e) => {
                  setFilters({ ...filters, minBacklinkValue: parseInt(e.target.value) });
                  setPage(1);
                }}
                className="w-full"
              />

              {/* Has Email */}
              <select
                value={filters.hasEmail}
                onChange={(e) => {
                  setFilters({ ...filters, hasEmail: e.target.value });
                  setPage(1);
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
              >
                <option value="all">Any Email Status</option>
                <option value="true">Has Emails</option>
                <option value="false">No Emails</option>
              </select>

              {/* Guest Post Only */}
              <label className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-600">
                <input
                  type="checkbox"
                  checked={filters.guestPostOnly}
                  onChange={(e) => {
                    setFilters({ ...filters, guestPostOnly: e.target.checked });
                    setPage(1);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-white text-sm">Guest Post Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="text-gray-300">
            {selectedSites.size > 0 && (
              <span>{selectedSites.size} site(s) selected</span>
            )}
          </div>
          <div className="flex gap-2">
            {selectedSites.size > 0 && (
              <>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  ✓ Mark as Rescrape
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                  📥 Export Selected
                </button>
              </>
            )}
            <button
              onClick={fetchSites}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSites.size === sites.length && sites.length > 0}
                      onChange={handleToggleAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-gray-300">URL</th>
                  <th className="px-4 py-3 text-left text-gray-300 cursor-pointer">Status</th>
                  <th className="px-4 py-3 text-center text-gray-300">Emails</th>
                  <th className="px-4 py-3 text-center text-gray-300">Spam Score</th>
                  <th className="px-4 py-3 text-center text-gray-300">Backlink Value</th>
                  <th className="px-4 py-3 text-center text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      ⏳ Loading...
                    </td>
                  </tr>
                ) : sites.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No sites found. <a href="/go-aibob/import" className="text-cyan-400 hover:underline">Import URLs</a> to get started!
                    </td>
                  </tr>
                ) : (
                  sites.map((site, idx) => (
                    <motion.tr
                      key={site.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSites.has(site.id)}
                          onChange={() => handleToggleSite(site.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 truncate max-w-xs"
                          title={site.url}
                        >
                          {site.url}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[site.status]}`}>
                          {statusIcon[site.status]} {site.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-gray-300">{site.emails_found}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold ${site.spam_score > 70 ? 'text-red-400' : site.spam_score > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {site.spam_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-green-400 font-semibold">${site.backlink_value.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => window.location.href = `/go-aibob/site/${site.id}`}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                          title="View details"
                        >
                          👁️
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sites.length > 0 && (
            <div className="px-4 py-4 bg-gray-900 border-t border-gray-700 flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded text-sm"
                >
                  ← Previous
                </button>
                <span className="text-gray-300 px-4 py-2">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * pageSize >= totalCount}
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SitesTable;
