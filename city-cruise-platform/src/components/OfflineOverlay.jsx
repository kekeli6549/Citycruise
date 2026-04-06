import React from 'react';
import { WifiOff } from 'lucide-react';
import { useAuthStore } from '../context/authStore';

const OfflineOverlay = () => {
  const isOnline = useAuthStore((state) => state.isOnline);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-slate-100 mx-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="text-red-500 animate-pulse" size={32} />
        </div>
        <h3 className="text-2xl font-heading text-slate-900 mb-2">Connection Lost</h3>
        <p className="text-slate-500 font-body mb-6">
          It looks like your internet has taken a cruise elsewhere. Please check your connection to continue.
        </p>
        <div className="text-[10px] font-mono uppercase tracking-widest text-brand-blue animate-bounce">
          Attempting to reconnect...
        </div>
      </div>
    </div>
  );
};

export default OfflineOverlay;