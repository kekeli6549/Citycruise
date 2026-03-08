import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../context/authStore'; // Imported to link session

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error, logout } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) return;

    const result = await login({ email, password });
    
    if (result.success) {
      const currentUser = useAuthStore.getState().user;
      
      if (currentUser?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        logout();
        alert('Access Denied: Admin privileges required.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-slate-200">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading tracking-tight">System Authority</h1>
          <p className="text-slate-500 text-sm mt-2">Enter credentials to access the command center.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 ring-slate-200 transition-all font-medium"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Security Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 ring-slate-200 transition-all font-medium"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-100"
          >
            {isLoading ? 'Authenticating...' : 'Authenticate'} <ArrowRight size={16} />
          </button>
        </form>
        
        <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest mt-10">
          Encrypted Connection &bull; Terminal 01
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;