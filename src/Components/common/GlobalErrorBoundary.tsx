import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('💥 [Global Error Boundary caught an exception]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-main-bg p-6">
          <div className="max-w-lg w-full bg-surface border border-border rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>

            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-poppins font-semibold mb-3">
              Application Error
            </span>

            <h2 className="text-2xl font-poppins font-bold text-text-main mb-2 tracking-tight">
              Something went wrong
            </h2>

            <p className="text-text-muted text-sm font-roboto mb-6 leading-relaxed max-w-md">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>

            {import.meta.env.DEV && this.state.error?.stack && (
              <details className="w-full text-left bg-black/20 dark:bg-black/40 border border-border rounded-xl p-3 mb-6 overflow-x-auto text-xs font-mono text-text-muted">
                <summary className="cursor-pointer font-semibold mb-1 text-text-main hover:text-accent">
                  View Error Details
                </summary>
                <pre className="whitespace-pre-wrap text-[11px] mt-2 text-red-400/90 leading-tight">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-poppins font-semibold text-sm hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 cursor-pointer"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
