/**
 * Error Boundary for GO-AIBOB
 * Catches any JavaScript errors and displays a fallback UI
 */

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('GO-AIBOB Error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-gray-900 border border-red-500/30 rounded-xl p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-red-400 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-400 mb-4">
                The GO-AIBOB page encountered an error. Please try refreshing the page.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <h3 className="text-red-400 font-semibold mb-2">Error Details:</h3>
                <p className="text-sm text-gray-300 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Go to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
