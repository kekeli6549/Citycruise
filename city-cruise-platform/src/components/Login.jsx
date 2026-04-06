import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';



const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error: apiError } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) tempErrors.email = "Invalid email format";
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 8) tempErrors.password = "Minimum 8 characters required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="md:w-[45%] bg-brand-blue p-12 lg:p-20 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-4 mb-24">
             {/* Logo container if needed */}
          </Link>
          <h2 className="text-5xl lg:text-6xl font-heading leading-tight mb-8 text-white">Your Elite <br />Service Dashboard</h2>
          <p className="text-blue-100/70 text-lg max-w-sm">Manage your fleet bookings, cleaning schedules, and professional training certifications in one place.</p>
        </div>
        <div className="glass-card mt-12 p-8 rounded-[2rem] bg-white/10 border-white/20 relative z-10 max-w-sm">
          <p className="text-sm italic mb-6 leading-relaxed text-blue-50">"The standard for vehicle hire and professional cleaning training in Nigeria. Truly a world-class experience."</p>
          <div className="flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&h=100&auto=format&fit=crop" className="w-12 h-12 rounded-full border-2 border-white/30" alt="Corporate Client" />
            <div>
              <div className="text-sm font-bold">Musa Ibrahim</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60">Logistics Manager</div>
            </div>
          </div>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="md:w-[55%] flex items-center justify-center p-8 lg:p-20">
        <div className="max-w-md w-full">
          <h3 className="text-4xl font-heading text-slate-900 mb-2">Welcome back</h3>
          <p className="text-slate-500 mb-10 font-body">Please enter your credentials to access your account.</p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {apiError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                {apiError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@example.com" className={`w-full p-4 bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all`} />
              {errors.email && <p className="text-[10px] text-red-500 font-mono italic">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Password</label>
                <Link to="/forgot-password" size={14} className="text-xs text-brand-blue font-bold hover:underline">Forgot?</Link>
              </div>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className={`w-full p-4 bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-100'} rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all`} />
              {errors.password && <p className="text-[10px] text-red-500 font-mono italic">{errors.password}</p>}
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-brand-blue text-white py-4 rounded-xl font-bold shadow-2xl transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'
                  }`}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
          <p className="text-center mt-12 text-sm text-slate-500 font-body">
            Don't have an account? <Link to="/signup" className="text-brand-blue font-bold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;