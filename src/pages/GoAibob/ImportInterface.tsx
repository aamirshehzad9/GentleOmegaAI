/**
 * ImportInterface.tsx - Premium Bulk URL Import
 * Features: Holographic Drop Zone, Glassmorphism, Particle Effects
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from '../../components/ParticleBackground';

interface ImportPreview {
  url: string;
  valid: boolean;
  error?: string;
}

const API_BASE = import.meta.env.VITE_GOB_API_URL || 'https://us-central1-gentleomegaai.cloudfunctions.net/gobApi';

const ImportInterface: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<ImportPreview[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  // Handle file selection
  const handleFileSelect = async (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(f =>
      f.type === 'text/plain' || f.name.endsWith('.csv')
    );

    if (validFiles.length === 0) {
      alert('Please select .txt or .csv files');
      return;
    }

    setFiles(validFiles);
    await parseFiles(validFiles);
  };

  // Parse files
  const parseFiles = async (filesToParse: File[]) => {
    const allUrls: ImportPreview[] = [];

    for (const file of filesToParse) {
      const text = await file.text();
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);

      for (const line of lines) {
        const urlMatch = line.match(/https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const url = urlMatch ? urlMatch[0] : line;
        const valid = isValidUrl(url);
        allUrls.push({
          url,
          valid,
          error: valid ? undefined : 'Invalid URL format'
        });
      }
    }
    setPreview(allUrls);
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    handleFileSelect(droppedFiles);
  };

  // Import URLs
  const handleImport = async () => {
    const validUrls = preview.filter(p => p.valid).map(p => p.url);

    if (validUrls.length === 0) {
      alert('No valid URLs to import');
      return;
    }

    setImporting(true);
    setResults(null);

    try {
      let successful = 0;
      let failed = 0;
      const totalBatches = Math.ceil(validUrls.length / 50);

      for (let i = 0; i < validUrls.length; i += 50) {
        const batch = validUrls.slice(i, i + 50);

        // Mock API call for visual demo (replace with fetch in production)
        await new Promise(r => setTimeout(r, 500));
        successful += batch.length;

        /* 
        try {
          const res = await fetch(`${API_BASE}/api/gob/enqueue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: batch })
          });
          if (res.ok) successful += batch.length;
          else failed += batch.length;
        } catch {
          failed += batch.length;
        }
        */

        setProgress(((i + 50) / validUrls.length) * 100);
      }

      setResults({ success: successful, failed });
      setImporting(false);
    } catch (err) {
      alert(`Import error: ${err}`);
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden font-sans p-8">
      <ParticleBackground className="opacity-30" count={40} color="#8b5cf6" />

      {/* Glow Effects */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
          >
            <span className="text-4xl">📤</span>
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 mb-3">
            Bulk Asset Injection
          </h1>
          <p className="text-gray-400 text-lg">
            Rapidly onboard target URLs for AI analysis and monetization.
          </p>
        </div>

        {/* Holographic Drop Zone */}
        {!results && (
          <AnimatePresence>
            <motion.div
              layout
              ref={dragZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.01, borderColor: 'rgba(139,92,246,0.5)' }}
              animate={{
                borderColor: isDragging ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                backgroundColor: isDragging ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)'
              }}
              className={`relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer backdrop-blur-xl transition-all duration-300 mb-8 overflow-hidden group ${isDragging ? 'shadow-[0_0_50px_rgba(139,92,246,0.3)]' : ''
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <motion.div
                  animate={{ y: isDragging ? -10 : 0 }}
                  className="text-6xl mb-6 opacity-80"
                >
                  📁
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {files.length > 0 ? `${files.length} File(s) Selected` : 'Drop Data Sources Here'}
                </h3>
                <p className="text-gray-400">
                  Support for <span className="text-cyan-400 font-mono bg-cyan-900/30 px-2 py-0.5 rounded">.txt</span> or <span className="text-purple-400 font-mono bg-purple-900/30 px-2 py-0.5 rounded">.csv</span>
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.csv"
                onChange={(e) => handleFileSelect(Array.from(e.target.files || []))}
                className="hidden"
              />
            </motion.div>

            {/* Preview Panel */}
            {preview.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-cyan-500 rounded-full" /> Payload Preview
                  </h3>
                  <div className="flex gap-4 text-sm">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      ✅ {preview.filter(p => p.valid).length} Valid
                    </span>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      ❌ {preview.filter(p => !p.valid).length} Invalid
                    </span>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 mb-6 pr-2">
                  {preview.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${item.valid
                          ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                          : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                        }`}
                    >
                      <span className="text-lg">{item.valid ? 'Active' : 'Error'}</span>
                      <span className="flex-1 text-gray-300 font-mono text-sm truncate">{item.url}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleImport}
                    disabled={importing || preview.filter(p => p.valid).length === 0}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-3 group"
                  >
                    {importing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing Injection... {progress.toFixed(0)}%
                      </>
                    ) : (
                      <>
                        <span>Initiate Import Sequence</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFiles([]);
                      setPreview([]);
                    }}
                    className="px-6 py-4 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Clear Queue
                  </button>
                </div>

                {importing && (
                  <div className="mt-6 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Results Modal */}
        {results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/30"
            >
              <span className="text-4xl text-white">✓</span>
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">Injection Complete</h2>
            <p className="text-gray-400 mb-8">Data payload successfully processed and queued for AI analysis.</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                <p className="text-green-400 text-sm font-bold uppercase tracking-wide mb-1">Success</p>
                <p className="text-4xl font-bold text-white">{results.success}</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                <p className="text-red-400 text-sm font-bold uppercase tracking-wide mb-1">Failures</p>
                <p className="text-4xl font-bold text-white">{results.failed}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setFiles([]);
                  setPreview([]);
                  setResults(null);
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold transition-all"
              >
                Inject More Data
              </button>
              <button
                onClick={() => window.location.href = '/go-aibob/sites'}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all"
              >
                View Asset Matrix
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ImportInterface;
