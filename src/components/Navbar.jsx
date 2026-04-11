import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

// Importing the logo ensures the build tool finds the correct path
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
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 px-8 h-24 flex justify-between items-center transition-all duration-300">
      {/* Logo Area */}
      <Link to="/" className="flex items-center gap-4 z-[100]">
        {/* Container:
            - Borders and Shadows removed entirely for a clean, integrated look
            - Transparent background to blend with the navbar
            - Removed overflow restrictions to allow text legibility
        */}
        <div className="h-20 min-w-[8rem] flex items-center justify-center relative shrink-0">
          <img 
            src={logo} 
            alt="City Cruise Logo" 
            className="h-full w-auto object-contain scale-[1.8]" // Significant magnification for text legibility
            onError={(e) => { e.target.src = "/logo7.png"; }}
          />
        </div>
        
        <span className="text-brand-dark font-heading text-xl font-bold tracking-tight leading-tight uppercase">
          City Cruise <br className="sm:hidden" /> International
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-10">
        <div className="flex space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.path} className="text-sm font-medium text-slate-500 hover:text-brand-blue transition-colors">
              {link.name}
            </a>
          ))}
        </div>
        <div className="h-6 w-[1px] bg-slate-200 mx-2" />
        <Link to="/login" className="text-sm font-bold text-slate-700">Login</Link>
        <Link to="/signup" className="bg-brand-blue text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-brand-blue/20">
          Get Started
        </Link>
      </div>

      {/* Hamburger Toggle Button */}
      <button 
        className="md:hidden p-2 z-[100] text-brand-dark" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-[90] md:hidden flex flex-col p-8 pt-32"
          >
            {/* Navigation Links */}
            <div className="flex flex-col gap-8">
              <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">Menu</p>
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.path} 
                  onClick={() => setIsOpen(false)} 
                  className="text-4xl font-heading font-bold text-brand-dark flex items-center justify-between border-b border-slate-50 pb-4"
                >
                  {link.name}
                  <ArrowRight className="text-brand-blue" size={24} />
                </a>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto space-y-4">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="block text-center py-4 text-slate-600 font-bold uppercase tracking-widest text-xs border border-slate-100 rounded-xl"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={() => setIsOpen(false)} 
                className="block bg-brand-blue text-white py-5 rounded-xl text-center font-bold uppercase tracking-widest text-xs shadow-xl"
              >
                Join the Elite
              </Link>
              <p className="text-center text-[10px] text-slate-400 pt-4 uppercase">
                © 2026 City Cruise International
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;