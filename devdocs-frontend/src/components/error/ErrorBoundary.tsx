'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can also log to an error reporting service like Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-[#07b9d5]/20 rounded-2xl shadow-2xl shadow-[#07b9d5]/10 p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                <AlertTriangle size={32} className="text-white" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white text-center mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-400 text-center mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-black/50 border border-red-500/20 rounded-lg">
                <p className="text-xs font-mono text-red-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-black px-6 py-3 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-[#07b9d5]/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/20 hover:border-[#07b9d5]/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
