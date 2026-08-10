import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

/**
 * RouteErrorBoundary component
 * Catch-all React Router Error Boundary element for gracefully handling route rendering errors,
 * network failures, or unhandled exceptions across the application.
 */
export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'An unexpected error occurred while loading this page.';
  let errorStatus: number | string = 'Error';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || 'Page not found or inaccessible.';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[500px] w-full flex items-center justify-center p-6 sm:p-12">
      <div className="max-w-lg w-full bg-surface border border-border rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>

        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-poppins font-semibold mb-3">
          {errorStatus}
        </span>

        <h2 className="text-2xl font-poppins font-bold text-text-main mb-2 tracking-tight">
          Application Error
        </h2>

        <p className="text-text-muted text-sm font-roboto mb-6 leading-relaxed max-w-md">
          {errorMessage}
        </p>

        {import.meta.env.DEV && error instanceof Error && error.stack && (
          <details className="w-full text-left bg-black/20 dark:bg-black/40 border border-border rounded-xl p-3 mb-6 overflow-x-auto text-xs font-mono text-text-muted">
            <summary className="cursor-pointer font-semibold mb-1 text-text-main hover:text-accent">
              View Error Stack
            </summary>
            <pre className="whitespace-pre-wrap text-[11px] mt-2 text-red-400/90 leading-tight">
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-accent/10 transition-colors text-text-main font-poppins text-sm font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={handleRefresh}
            className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors font-poppins text-sm font-medium shadow-md shadow-accent/20 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Reload Page
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-2.5 rounded-xl border border-border hover:bg-text-muted/10 transition-colors text-text-muted font-poppins text-sm font-medium flex items-center justify-center gap-2 mt-1"
          >
            <Home size={16} />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
