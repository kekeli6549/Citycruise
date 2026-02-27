import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Mentors from './components/Mentors';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './context/authStore';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Sub-component to handle conditional UI layout
const AppLayout = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="relative min-h-screen bg-white dark:bg-brand-dark transition-colors duration-500">
      {/* Only show Navbar on public pages */}
      {!isDashboard && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
      
      <div className={!isDashboard ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<><Hero /><Features /><Mentors /><Contact /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </div>

      {/* Only show Footer on public pages */}
      {!isDashboard && (
        <footer className="bg-white dark:bg-[#0B0F1A] border-t border-slate-100 dark:border-slate-800 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-heading text-lg font-bold">C</div>
                <span className="text-slate-900 dark:text-white font-heading text-lg font-bold tracking-tight">City Cruise</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-body">Empowering the African Diaspora through elite mentorship.</p>
            </div>
            <div>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-body">
                <li><a href="#expertise">Expertise</a></li>
                <li><Link to="/signup">Admissions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-6">Stay Connected</h4>
              <div className="flex flex-col gap-4">
                <input type="email" placeholder="EMAIL ADDRESS" className="bg-slate-50 dark:bg-slate-900 border border-slate-100 px-4 py-3 rounded-xl text-[10px] font-mono outline-none" />
                <button className="bg-brand-blue text-white py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest">Subscribe</button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <ScrollToTop />
        <AppLayout darkMode={darkMode} setDarkMode={setDarkMode} />
      </Router>
    </div>
  );
}

export default App;