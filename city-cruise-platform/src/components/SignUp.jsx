import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Check, X } from 'lucide-react';
import { useAuthStore } from '../context/authstore';

const Signup = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', terms: false });
  const { signup, isLoading, error: apiError } = useAuthStore();
  const [errors, setErrors] = useState({});

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "Contain Numbers & Letters", test: (pw) => /[A-Za-z]/.test(pw) && /\d/.test(pw) },
    { label: "Contains a symbol (!@#$%^&*)", test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  const strengthScore = passwordRequirements.filter(req => req.test(formData.password)).length;
  const strengthWidth = (strengthScore / passwordRequirements.length) * 100;

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "Required";
    if (!formData.lastName) tempErrors.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = "Invalid email";
    if (strengthScore < 3) tempErrors.password = "Password too weak";
    if (!formData.terms) tempErrors.terms = "You must agree to terms";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const result = await signup(formData);

      if (result.success) {
        navigate('/dashboard');
      } else {
        console.error(result.message);
      }
    }
  };

  return (
    <div className="min-h-[95vh] flex items-center justify-center p-6 bg-white dark:bg-brand-dark transition-colors">
      <div className="max-w-7xl w-full grid md:grid-cols-5 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800">
        <div className="md:col-span-2 bg-brand-dark p-16 flex flex-col justify-between text-white relative">
          <div className="relative z-10">
            <h2 className="text-5xl font-heading leading-[1.1] mb-8">Join the next <br /><span className="italic text-brand-blue">Generation</span> of leaders.</h2>
            <div className="space-y-6">
              {["Global Mentorship Network", "Industry-Recognized Certification", "Lifetime Alumni Access"].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-brand-blue" />
                  <span className="text-sm font-body text-slate-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 pt-10 border-t border-slate-800">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-brand-dark shadow-xl" alt="user" />
              ))}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Trusted by 2,000+ Professionals</p>
          </div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px]" />
        </div>

        <div className="md:col-span-3 bg-white dark:bg-slate-900/40 p-12 lg:p-20">
          <div className="max-w-md mx-auto">
            <div className="mb-12">
              <h3 className="text-3xl font-heading text-slate-900 dark:text-white mb-2">Create Account</h3>
              <p className="text-slate-500 text-[11px] font-mono uppercase tracking-widest">Step 01: Professional Details</p>
            </div>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-8">
                <div className={`border-b ${errors.firstName ? 'border-red-400' : 'border-slate-100 dark:border-slate-800'} py-2`}>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400 mb-1">First Name</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="John" className="w-full bg-transparent outline-none text-slate-900 dark:text-white" />
                </div>
                <div className={`border-b ${errors.lastName ? 'border-red-400' : 'border-slate-100 dark:border-slate-800'} py-2`}>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400 mb-1">Last Name</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Doe" className="w-full bg-transparent outline-none text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className={`border-b ${errors.email ? 'border-red-400' : 'border-slate-100 dark:border-slate-800'} py-2`}>
                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400 mb-1">Work Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@company.com" className="w-full bg-transparent outline-none text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-4">
                <div className={`border-b ${errors.password ? 'border-red-400' : 'border-slate-100 dark:border-slate-800'} py-2`}>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400 mb-1">Set Password</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="w-full bg-transparent outline-none text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-3">
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${strengthWidth}%` }} />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${req.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                        {req.test(formData.password) ? <Check size={12} /> : <X size={12} />}
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.checked })} className={`mt-1 w-4 h-4 rounded border-slate-300 text-brand-blue ${errors.terms ? 'ring-2 ring-red-400' : ''}`} />
                <p className="text-[10px] text-slate-500 leading-relaxed">I agree to the <a href="#" className="text-brand-blue underline">Terms of Excellence</a>.</p>
              </div>
              {apiError && <p className="text-red-500 text-xs mt-2 text-center">{apiError}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-dark dark:bg-brand-blue text-white py-5 rounded-2xl font-bold uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating Account...' : 'Begin Journey'}
                {!isLoading && <ArrowRight size={14} />}
              </button>
            </form>
            <p className="mt-10 text-center text-[11px] text-slate-500 font-body">Already have an account? <Link to="/login" className="text-brand-blue font-bold">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;