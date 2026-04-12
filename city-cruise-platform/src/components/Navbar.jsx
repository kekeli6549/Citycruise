import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import logo from '../assets/logo7.png'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Courses', path: '/#courses' },
    { name: 'Expertise', path: '/#expertise' },
    { name: 'Team', path: '/#team' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[150] bg-white border-b border-slate-100 px-6 md:px-12 h-24 md:h-32 flex justify-between items-center transition-all duration-300">
      {/* Logo Area */}
      <Link to="/" className="flex items-center gap-4 md:gap-6 z-[200] max-w-[85%] group">
        <div className="h-16 md:h-24 w-[clamp(80px,15vw,200px)] flex items-center justify-center relative shrink-0">
          <img 
            src={logo} 
            alt="City Cruise Logo" 
            className="h-full w-full object-contain transform-gpu transition-transform duration-500 group-hover:scale-105" 
            onError={(e) => { e.target.src = "/logo7.png"; }}
          />
        </div>
        
        <span className="text-brand-dark font-heading text-[clamp(14px,2vw,28px)] font-bold tracking-tight leading-[1.1] uppercase">
          City Cruise <br className="hidden sm:block" /> International
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-12">
        <div className="flex space-x-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.path} className="text-sm font-semibold text-slate-500 hover:text-brand-blue transition-colors">
              {link.name}
            </a>
          ))}
        </div>
        <div className="h-10 w-[1px] bg-slate-200 mx-2" />
        <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-brand-blue transition-colors">Login</Link>
        <Link to="/signup" className="bg-brand-blue text-white px-10 py-4 rounded-full font-bold text-sm shadow-2xl shadow-brand-blue/20 hover:bg-brand-dark transition-all transform hover:-translate-y-0.5">
          Get Started
        </Link>
      </div>

      {/* Hamburger Button */}
      <button 
        className="lg:hidden p-4 z-[200] text-brand-dark bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-transform active:scale-90" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[190] lg:hidden flex flex-col overflow-y-auto scrollbar-hide"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }} // Hides scrollbar in IE/Firefox
          >
            {/* Added a container with padding and min-height to prevent jamming */}
            <div className="flex flex-col min-h-full p-10 pt-40 pb-10">
              <div className="flex flex-col gap-10 flex-1">
                <p className="text-[12px] font-mono uppercase tracking-[0.5em] text-slate-400 font-bold">Main Navigation</p>
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.path} 
                    onClick={() => setIsOpen(false)} 
                    className="text-4xl font-heading font-bold text-brand-dark flex items-center justify-between border-b border-slate-100 pb-8 transition-colors hover:text-brand-blue"
                  >
                    {link.name}
                    <ArrowRight className="text-brand-blue" size={32} />
                  </a>
                ))}
              </div>

              {/* Action Buttons Section */}
              <div className="mt-16 space-y-5">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-6 text-slate-700 font-bold uppercase tracking-widest text-sm border border-slate-100 rounded-3xl bg-slate-50 shadow-sm"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)} 
                  className="block bg-brand-blue text-white py-6 rounded-3xl text-center font-bold uppercase tracking-widest text-sm shadow-2xl shadow-brand-blue/30"
                >
                  Join the Elite Fleet
                </Link>
                <div className="flex justify-center gap-2 pt-6 opacity-30">
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Inline style tag to hide scrollbar in Chrome/Safari/Edge */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </nav>
  );
};

export default Navbar;