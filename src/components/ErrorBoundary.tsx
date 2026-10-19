import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-neutral-800/90 border border-neutral-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-lg">
              <AlertTriangle size={36} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-white">
              {this.props.fallbackTitle || 'Đã xảy ra lỗi tải trang'}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mb-4 leading-relaxed">
              {this.props.fallbackDescription ||
                'Hệ thống gặp sự cố hiển thị một phần giao diện. Bạn có thể tải lại trang hoặc quay lại trang chủ.'}
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-neutral-900/90 border border-neutral-700/60 text-left text-[11px] text-rose-300 font-mono overflow-auto max-h-28">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Tải lại trang</span>
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home size={14} />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
