import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../context/authstore';

const ForgotPassword = () => {
  const { requestPasswordReset, isLoading, error: apiError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const result = await requestPasswordReset(email);
    if (result.success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel - High Contrast Aesthetic */}
      <div className="md:w-[45%] bg-brand-dark p-12 lg:p-20 flex flex-col justify-center text-white relative overflow-hidden">
        <div className="relative z-10">
          {/* UPDATED: Changed text-brand-blue to text-slate-200 and increased font size for legibility */}
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-200 hover:text-brand-blue font-mono text-xs uppercase tracking-[0.3em] mb-12 hover:gap-4 transition-all duration-300">
            <ArrowLeft size={16} /> BACK TO LOGIN
          </Link>
          
          <h2 className="text-5xl lg:text-6xl font-heading leading-tight mb-8">Secure your <br /><span className="italic text-brand-blue">Access</span>.</h2>
          <p className="text-slate-400 text-lg max-w-sm font-body">Don't worry, it happens to the best of us. We'll help you get back into your elite dashboard.</p>
        </div>
        
        {/* Aesthetic background glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px]" />
      </div>

      {/* Right Panel - Form Area */}
      <div className="md:w-[55%] flex items-center justify-center p-8 lg:p-20">
        <div className="max-w-md w-full">
          {!submitted ? (
            <>
              <h3 className="text-4xl font-heading text-slate-900 mb-2">Forgot Password?</h3>
              <p className="text-slate-500 mb-10 font-body">Enter the email associated with your account and we'll send a reset link.</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {apiError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                    {apiError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="name@example.com" 
                      className={`w-full p-4 pl-12 bg-slate-50 border ${error ? 'border-red-400' : 'border-slate-100'} rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all`} 
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                  {error && <p className="text-[10px] text-red-500 font-mono italic">{error}</p>}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-brand-blue text-white py-4 rounded-xl font-bold shadow-2xl transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                  >
                    {isLoading ? 'Sending Request...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              <h3 className="text-3xl font-heading text-slate-900 mb-4">Check your Inbox</h3>
              <p className="text-slate-500 mb-10 font-body leading-relaxed">
                We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. Please check your email to continue.
              </p>
              <Link to="/login" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-black">
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;