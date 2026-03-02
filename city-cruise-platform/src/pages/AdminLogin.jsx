import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../context/authStore'; // Imported to link session

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore(); // Grab login function from store

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple bypass for frontend watching
    if (password === 'admin123') {
      // Log in as an admin in the global state
      login({
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin',
        email: 'admin@citycruise.com',
        profilePic: null
      });
      
      navigate('/admin/dashboard');
    } else {
      alert('Unauthorized access.');
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

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Admin ID" 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 ring-slate-200 transition-all"
              defaultValue="root_admin"
              readOnly
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Security Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 ring-slate-200 transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            Authenticate <ArrowRight size={16} />
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