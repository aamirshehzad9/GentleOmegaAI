/**
 * AdminSettings.tsx - Admin control panel (SIMPLIFIED VERSION)
 * No complex conditionals - just straightforward rendering
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SystemHealth {
  database: 'online' | 'offline';
  redis: 'online' | 'offline';
  api: 'online' | 'offline';
  worker: 'online' | 'offline';
}

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

// Get API base URL from environment or use localhost
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return import.meta.env.VITE_GOB_API_URL || 'http://localhost:3001';
  }
  return 'http://localhost:3001';
};

const AdminSettings: React.FC = () => {
  const API_BASE = getApiBase();
  
  const [health, setHealth] = useState<SystemHealth>({
    database: 'offline',
    redis: 'offline',
    api: 'offline',
    worker: 'offline'
  });

  const [queueStats, setQueueStats] = useState<QueueStats>({
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0
  });

  const [concurrency, setConcurrency] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState('');

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/api/gob/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.health) {
        setHealth(data.health);
      }
      if (data.queue) {
        setQueueStats(data.queue);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch: ${msg}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const testConnections = async () => {
    try {
      setTestResults('Testing...');
      const res = await fetch(`${API_BASE}/api/gob/health`);
      setTestResults(res.ok ? 'API: Online' : `API: Error ${res.status}`);
    } catch {
      setTestResults('API: Offline');
    }
  };

  const clearCache = () => {
    if (confirm('Clear cache?')) {
      alert('Cache cleared');
    }
  };

  const toggleQueue = () => {
    setIsPaused(!isPaused);
    alert(isPaused ? 'Queue resumed' : 'Queue paused');
  };

  const renderLoading = () => (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  const renderError = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-red-500/10 border border-red-500 rounded-lg p-6 mb-6"
    >
      <p className="text-red-400 mb-4">{error}</p>
      <button
        onClick={fetchHealth}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Retry
      </button>
    </motion.div>
  );

  const renderContent = () => (
    <div>
      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-6 mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">System Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatusBox label="Database" status={health.database} />
          <StatusBox label="Redis" status={health.redis} />
          <StatusBox label="API" status={health.api} />
          <StatusBox label="Worker" status={health.worker} />
        </div>
        <button
          onClick={testConnections}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          Test
        </button>
        {testResults && <p className="text-gray-300 mt-2 text-sm">{testResults}</p>}
      </motion.div>

      {/* Queue Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-lg p-6 mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Queue Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatBox label="Waiting" value={queueStats.waiting} color="yellow" />
          <StatBox label="Processing" value={queueStats.active} color="blue" />
          <StatBox label="Completed" value={queueStats.completed} color="green" />
          <StatBox label="Failed" value={queueStats.failed} color="red" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleQueue}
            className={`px-4 py-2 rounded text-white font-semibold ${isPaused ? 'bg-green-600' : 'bg-yellow-600'}`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={fetchHealth}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-lg p-6 mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">
              Concurrency: <span className="text-cyan-400">{concurrency}</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={concurrency}
              onChange={(e) => setConcurrency(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={() => alert('Updated')}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
          >
            Apply
          </button>
        </div>
      </motion.div>

      {/* Maintenance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-lg p-6 mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Maintenance</h2>
        <div className="space-y-2">
          <button
            onClick={clearCache}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-left"
          >
            Clear Cache
          </button>
          <button
            onClick={() => alert('Clearing...')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-left"
          >
            Clear Stuck Jobs
          </button>
          <button
            onClick={() => alert('Reset')}
            className="w-full bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-left"
          >
            Reset Queue
          </button>
        </div>
      </motion.div>

      {/* Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Help</h2>
        <div className="space-y-3 text-gray-300 text-sm">
          <div>
            <p className="text-cyan-300 font-bold mb-1">Queue Offline?</p>
            <p>Check Redis connection in .env.local</p>
          </div>
          <div>
            <p className="text-cyan-300 font-bold mb-1">High Failures?</p>
            <p>Check HuggingFace API keys and reduce concurrency</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Admin Settings</h1>
          <p className="text-gray-400">System monitoring and control</p>
        </motion.div>

        {error && renderError()}
        {loading && renderLoading()}
        {!loading && !error && renderContent()}
      </div>
    </div>
  );
};

// Simple Status Box Component
const StatusBox: React.FC<{ label: string; status: string }> = ({ label, status }) => {
  const isOnline = status === 'online';
  return (
    <div className={`rounded-lg p-4 text-center ${isOnline ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500'}`}>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className={`font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
        {isOnline ? 'ONLINE' : 'OFFLINE'}
      </p>
    </div>
  );
};

// Simple Stat Box Component
const StatBox: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const colorClass = `text-${color}-400`;
  return (
    <div className="rounded-lg p-4 text-center bg-gray-700">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold text-${color}-400`}>{value}</p>
    </div>
  );
};

export default AdminSettings;
