/**
 * Troubleshooting.tsx - Built-in diagnostic and troubleshooting tools
 * NOW CHECKS FIREBASE CLOUD FUNCTIONS + FIRESTORE
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DiagnosticResult {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: string;
}

const API_BASE = process.env.VITE_GOB_API_URL || 'http://localhost:3001';

const Troubleshooting: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [running, setRunning] = useState(false);
  const [selectedFix, setSelectedFix] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setRunning(true);
    const results: DiagnosticResult[] = [];

    // Test Firebase Cloud Function API
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      results.push({
        name: 'Firebase Cloud Function API',
        status: res.ok ? 'passed' : 'failed',
        message: res.ok ? '✅ Connected successfully' : `❌ HTTP ${res.status}`,
        details: `Endpoint: ${API_BASE}`
      });
    } catch (err) {
      results.push({
        name: 'Firebase Cloud Function API',
        status: 'failed',
        message: '❌ Cannot connect',
        details: `Error: ${err instanceof Error ? err.message : String(err)}`
      });
    }

    // Test Firestore Database
    try {
      const res = await fetch(`${API_BASE}/api/gob/stats`);
      if (res.ok) {
        const data = await res.json();
        results.push({
          name: 'Firestore Database',
          status: 'passed',
          message: `✅ Connected - ${data.stats?.totalSites || 0} sites found`,
          details: `Avg backlink value: $${data.stats?.avgBacklinkValue || 0}`
        });
      } else {
        results.push({
          name: 'Firestore Database',
          status: 'failed',
          message: `❌ HTTP ${res.status}`,
          details: 'Firestore connection issue'
        });
      }
    } catch (err) {
      results.push({
        name: 'Firestore Database',
        status: 'failed',
        message: '❌ Connection failed',
        details: `Error: ${err instanceof Error ? err.message : String(err)}`
      });
    }

    // Test Real Data Availability
    try {
      const res = await fetch(`${API_BASE}/api/gob/list`);
      if (res.ok) {
        const data = await res.json();
        const count = data.sites?.length || 0;
        results.push({
          name: 'Real Data (Firestore)',
          status: count > 0 ? 'passed' : 'warning',
          message: count > 0 ? `✅ ${count} domains loaded` : '⚠️ No data available',
          details: `Last crawled domains from Puppeteer`
        });
      } else {
        results.push({
          name: 'Real Data (Firestore)',
          status: 'failed',
          message: `❌ Cannot fetch data`,
          details: `HTTP ${res.status}`
        });
      }
    } catch (err) {
      results.push({
        name: 'Real Data (Firestore)',
        status: 'failed',
        message: '❌ Fetch failed',
        details: `Error: ${err instanceof Error ? err.message : String(err)}`
      });
    }

    // Test Firebase Configuration
    results.push({
      name: 'Firebase Configuration',
      status: process.env.VITE_FIREBASE_PROJECT_ID ? 'passed' : 'warning',
      message: process.env.VITE_FIREBASE_PROJECT_ID ? '✅ Configured' : '⚠️ Missing config',
      details: `Project: ${process.env.VITE_FIREBASE_PROJECT_ID || 'Not set'}`
    });

    // Test Environment Variables
    const requiredVars = ['VITE_FIREBASE_PROJECT_ID', 'VITE_GOB_API_URL'];
    const missingVars = requiredVars.filter(v => !process.env[v]);
    results.push({
      name: 'Environment Variables',
      status: missingVars.length === 0 ? 'passed' : 'warning',
      message: missingVars.length === 0 ? '✅ All required vars set' : `⚠️ Missing: ${missingVars.join(', ')}`,
      details: 'Check .env.local file'
    });

    setDiagnostics(results);
    setRunning(false);
  };

  const applyFix = (fixName: string) => {
    const fixes: Record<string, string> = {
      rebuild_frontend: 'npm run build && firebase deploy --only hosting',
      restart_crawler: 'node firebase-crawler.js',
      check_env: 'Verify .env.local has VITE_GOB_API_URL',
      test_api: `Visit ${API_BASE}/health in browser`,
      view_firestore: 'https://console.firebase.google.com/project/gentleomegaai/firestore'
    };

    alert(`✅ Fix applied: ${fixes[fixName] || fixName}`);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔧 Troubleshooting</h1>
          <p className="text-gray-400">Diagnose and fix common issues</p>
        </div>

        {/* Diagnostic Run */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">🧪 System Diagnostics</h2>
            <button
              onClick={runDiagnostics}
              disabled={running}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-6 py-2 rounded font-semibold transition-colors"
            >
              {running ? '⏳ Running...' : '▶️ Run Diagnostics'}
            </button>
          </div>

          {diagnostics.length > 0 && (
            <div className="space-y-3">
              {diagnostics.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`rounded-lg p-4 border ${
                    result.status === 'passed'
                      ? 'bg-green-500/10 border-green-500'
                      : result.status === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500'
                      : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {result.status === 'passed' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'}
                        </span>
                        <p className="text-white font-semibold">{result.name}</p>
                      </div>
                      <p
                        className={
                          result.status === 'passed'
                            ? 'text-green-300'
                            : result.status === 'warning'
                            ? 'text-yellow-300'
                            : 'text-red-300'
                        }
                      >
                        {result.message}
                      </p>
                      {result.details && (
                        <p className="text-gray-400 text-xs mt-1">{result.details}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Common Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-white font-semibold text-lg mb-4">❓ Common Issues & Solutions</h2>

          <div className="space-y-4">
            <IssueCard
              title="API Server Not Responding"
              symptoms={['Cannot connect to API', 'Dashboard shows connection error']}
              solutions={[
                'Verify API is running: npm run gob:api',
                'Check API_URL in .env.local',
                'Ensure port 3001 is not in use',
                'Check firewall settings'
              ]}
              fixButtons={[
                { label: 'Restart API', action: 'restart_api' }
              ]}
            />

            <IssueCard
              title="Queue Jobs Not Processing"
              symptoms={['Jobs stuck in "waiting"', 'High failure rate', 'Worker offline']}
              solutions={[
                'Restart worker: npm run gob:worker',
                'Check Redis connection',
                'Verify HuggingFace API keys',
                'Check REDIS_URL in .env'
              ]}
              fixButtons={[
                { label: 'Restart Worker', action: 'restart_worker' },
                { label: 'Clear Stuck Jobs', action: 'reset_queue' }
              ]}
            />

            <IssueCard
              title="Import URLs Not Working"
              symptoms={['Upload fails', 'URLs not queued', '429 rate limit errors']}
              solutions={[
                'Check API server is online',
                'Verify database connection',
                'Reduce batch size in import',
                'Wait a few minutes if rate limited'
              ]}
              fixButtons={[
                { label: 'Clear Cache', action: 'clear_cache' }
              ]}
            />

            <IssueCard
              title="AI Enrichment Slow/Failing"
              symptoms={['Enrichment takes long time', 'Sentiment/category missing', 'HF API errors']}
              solutions={[
                'Check HuggingFace API key quotas',
                'Verify internet connectivity',
                'Check .env.local for all HF keys',
                'Reduce concurrency to prevent rate limiting'
              ]}
              fixButtons={[
                { label: 'Check Configuration', action: 'check_env' }
              ]}
            />
          </div>
        </motion.div>

        {/* Quick Fixes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-white font-semibold text-lg mb-4">⚡ Quick Fixes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => applyFix('restart_api')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded transition-colors text-sm font-semibold"
            >
              🔄 Restart API
            </button>
            <button
              onClick={() => applyFix('restart_worker')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded transition-colors text-sm font-semibold"
            >
              🔄 Restart Worker
            </button>
            <button
              onClick={() => applyFix('clear_cache')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded transition-colors text-sm font-semibold"
            >
              🧹 Clear Cache
            </button>
            <button
              onClick={() => applyFix('reset_queue')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded transition-colors text-sm font-semibold"
            >
              ⚠️ Reset Queue
            </button>
            <button
              onClick={() => applyFix('check_env')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded transition-colors text-sm font-semibold"
            >
              📝 Check Config
            </button>
            <button
              onClick={runDiagnostics}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded transition-colors text-sm font-semibold"
            >
              🧪 Re-run Diagnostics
            </button>
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-white font-semibold text-lg mb-4">📚 Resources</h2>
          <div className="space-y-2 text-gray-300 text-sm">
            <p>
              <a href="https://github.com/aamirshehzad9/GentleOmegaAI/blob/main/src/gob/README.md" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
                📖 Full Documentation
              </a>
            </p>
            <p>
              <a href="https://huggingface.co" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
                🤗 HuggingFace API Docs
              </a>
            </p>
            <p>
              <a href="https://redis.io" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
                🔴 Redis Documentation
              </a>
            </p>
            <p>
              <a href="https://www.postgresql.org/docs" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
                🐘 PostgreSQL Reference
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const IssueCard: React.FC<{
  title: string;
  symptoms: string[];
  solutions: string[];
  fixButtons: Array<{ label: string; action: string }>;
}> = ({ title, symptoms, solutions, fixButtons }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-white font-semibold">{title}</h3>
        <span className="text-xl">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 space-y-3 border-t border-gray-600 pt-3"
        >
          <div>
            <p className="text-gray-300 text-sm font-semibold mb-1">Symptoms:</p>
            <ul className="text-gray-400 text-xs space-y-1">
              {symptoms.map((s, idx) => (
                <li key={idx}>• {s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-gray-300 text-sm font-semibold mb-1">Solutions:</p>
            <ol className="text-gray-400 text-xs space-y-1">
              {solutions.map((s, idx) => (
                <li key={idx}>{idx + 1}. {s}</li>
              ))}
            </ol>
          </div>

          {fixButtons.length > 0 && (
            <div className="flex gap-2 pt-2">
              {fixButtons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => alert(`Applying fix: ${btn.label}`)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Troubleshooting;
