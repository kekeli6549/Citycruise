import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Mentors from './components/Mentors';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';

// Wrapper to handle scroll-to-top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <ScrollToTop />
        <div className="relative min-h-screen bg-white dark:bg-brand-dark transition-colors duration-500">
          {/* Permanent UI Layer */}
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <div className="pt-20"> {/* Prevents content from hiding under fixed nav */}
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Features />
                  <Mentors />
                  <Contact />
                </>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>

          {/* UPGRADED FOOTER */}
          <footer className="bg-white dark:bg-[#0B0F1A] border-t border-slate-100 dark:border-slate-800 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
              
              {/* Brand Column */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-heading text-lg font-bold">C</div>
                  <span className="text-slate-900 dark:text-white font-heading text-lg font-bold tracking-tight">City Cruise</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed font-body">
                  Empowering the African Diaspora through elite professional mentorship and global innovation.
                </p>
              </div>

              {/* Links Columns */}
              <div>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-6">Platform</h4>
                <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-body">
                  <li><a href="#expertise" className="hover:text-brand-blue transition-colors">Expertise</a></li>
                  <li><a href="#team" className="hover:text-brand-blue transition-colors">Mentors</a></li>
                  <li><Link to="/signup" className="hover:text-brand-blue transition-colors">Admissions</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-6">Support</h4>
                <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-body">
                  <li><a href="#" className="hover:text-brand-blue transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-brand-blue transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-brand-blue transition-colors">Privacy</a></li>
                </ul>
              </div>

              {/* Newsletter Column */}
              <div>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-6">Stay Connected</h4>
                <div className="flex flex-col gap-4">
                  <input 
                    type="email" 
                    placeholder="EMAIL ADDRESS" 
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-3 rounded-xl text-[10px] font-mono outline-none focus:border-brand-blue w-full" 
                  />
                  <button className="bg-brand-blue text-white py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest hover:bg-blue-800 transition-colors shadow-lg shadow-brand-blue/10">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                © 2026 City Cruise International.
              </p>
              <div className="flex gap-6 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                <a href="#" className="hover:text-brand-blue transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-brand-blue transition-colors">Twitter</a>
                <a href="#" className="hover:text-brand-blue transition-colors">Instagram</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </div>
  );
}

export default App;