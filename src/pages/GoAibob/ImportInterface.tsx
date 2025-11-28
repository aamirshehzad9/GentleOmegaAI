/**
 * ImportInterface.tsx - Bulk URL import with drag-drop and validation
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ImportPreview {
  url: string;
  valid: boolean;
  error?: string;
}

const API_BASE = process.env.VITE_GOB_API_URL || 'http://localhost:3001';

const ImportInterface: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<ImportPreview[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragZoneRef = useRef<HTMLDivElement>(null);

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
        // Try to extract URL from CSV or plain text
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
    dragZoneRef.current?.classList.add('border-cyan-500', 'bg-cyan-500/10');
  };

  const handleDragLeave = () => {
    dragZoneRef.current?.classList.remove('border-cyan-500', 'bg-cyan-500/10');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleDragLeave();
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

        try {
          const res = await fetch(`${API_BASE}/api/gob/enqueue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: batch })
          });

          if (res.ok) {
            successful += batch.length;
          } else {
            failed += batch.length;
          }
        } catch {
          failed += batch.length;
        }

        setProgress(((i / 50 + 1) / totalBatches) * 100);
      }

      setResults({ success: successful, failed });
      setImporting(false);
    } catch (err) {
      alert(`Import error: ${err}`);
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📤 Import URLs</h1>
          <p className="text-gray-400">Bulk import websites for scraping and analysis</p>
        </div>

        {/* Drag & Drop Zone */}
        {!results && (
          <>
            <motion.div
              ref={dragZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-500 transition-colors mb-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Drag files here or click to select
              </h3>
              <p className="text-gray-400">
                Supported: .txt (one URL per line) or .csv
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.csv"
                onChange={(e) => handleFileSelect(Array.from(e.target.files || []))}
                className="hidden"
              />
            </motion.div>

            {/* Preview */}
            {preview.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 rounded-xl p-6 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    📋 Preview ({preview.length} URLs)
                  </h3>
                  <div className="text-sm text-gray-400">
                    ✅ {preview.filter(p => p.valid).length} valid, ❌ {preview.filter(p => !p.valid).length} invalid
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {preview.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`flex items-center gap-3 px-4 py-2 rounded ${
                        item.valid
                          ? 'bg-green-500/10 border border-green-500/20'
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}
                    >
                      <span>{item.valid ? '✅' : '❌'}</span>
                      <span className="flex-1 text-gray-300 text-sm truncate">{item.url}</span>
                      {item.error && (
                        <span className="text-red-400 text-xs">{item.error}</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Import Button */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleImport}
                    disabled={importing || preview.filter(p => p.valid).length === 0}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {importing ? (
                      <span className="flex items-center justify-center gap-2">
                        ⏳ Importing... {progress.toFixed(0)}%
                      </span>
                    ) : (
                      `✓ Import ${preview.filter(p => p.valid).length} URLs`
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFiles([]);
                      setPreview([]);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {importing && (
                  <div className="mt-4 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-cyan-600 h-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-8 text-center"
          >
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-white mb-4">Import Complete!</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                <p className="text-green-400 text-sm mb-1">Successfully Added</p>
                <p className="text-4xl font-bold text-white">{results.success}</p>
              </div>
              <div className={`${results.failed > 0 ? 'bg-red-500/20 border border-red-500' : 'bg-gray-700 border border-gray-600'} rounded-lg p-4`}>
                <p className={results.failed > 0 ? 'text-red-400' : 'text-gray-400'}>Failed</p>
                <p className="text-4xl font-bold text-white">{results.failed}</p>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm">
                💡 URLs are queued for scraping. Check the<br />
                <a href="/go-aibob/dashboard" className="hover:underline font-semibold">Dashboard</a> to monitor progress
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFiles([]);
                  setPreview([]);
                  setResults(null);
                }}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ➕ Import More URLs
              </button>
              <button
                onClick={() => window.location.href = '/go-aibob/sites'}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                📊 View Sites
              </button>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gray-800 rounded-xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">❓ How to Use</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              <strong>1. Prepare your file:</strong> Create a .txt file with one URL per line or a .csv file with URLs in the first column
            </p>
            <p>
              <strong>2. Upload:</strong> Drag and drop files or click to select them
            </p>
            <p>
              <strong>3. Review:</strong> Check the preview to ensure all URLs are valid (✅ means valid)
            </p>
            <p>
              <strong>4. Import:</strong> Click "Import" to start adding URLs to the queue
            </p>
            <p>
              <strong>5. Monitor:</strong> Check the Dashboard to see scraping progress in real-time
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImportInterface;
