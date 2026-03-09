import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#161B2A] rounded-[2rem] p-10 shadow-glass border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            
            <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Interface Glitch
            </h1>
            
            <p className="font-body text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
              Something went wrong while rendering this view. Don't worry, your progress is safe.
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-3 bg-brand-blue hover:bg-blue-700 text-white font-heading font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-brand-blue/20"
              >
                <RefreshCcw size={18} />
                REFRESH VIEW
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center justify-center gap-3 bg-transparent text-slate-500 dark:text-slate-400 font-heading font-bold py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
              >
                <Home size={16} />
                Return to Port
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;