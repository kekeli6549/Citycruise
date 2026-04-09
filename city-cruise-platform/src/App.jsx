import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Award, X, Menu, LogOut, 
  ChevronRight, User, ArrowRight, Github, Twitter, Linkedin 
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Mentors from './components/Mentors';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import Checkout from './pages/Checkout';
import CoursePlayer from './pages/CoursePlayer';
import ExamPage from './pages/ExamPage';
import ExamsHub from './pages/ExamsHub';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminLogin from './pages/AdminLogin'; 
import { useAuthStore } from './context/authStore';
import ErrorBoundary from './components/ErrorBoundary';

// Connectivity Components
import NetworkStatus from './components/NetworkStatus';
import OfflineOverlay from './components/OfflineOverlay';

// Updated to use logo6.png
import logo from './assets/logo7.png';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'admin'; 
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Academy', path: '/courses', icon: BookOpen },
    { name: 'Certifications', path: '/exams', icon: Award },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden shrink-0">
            <img 
              src={logo} 
              alt="City Cruise Logo" 
              className="w-full h-full object-contain scale-110" 
              onError={(e) => { e.target.src = "/logo7.png"; }}
            />
          </div>
          <span className="font-heading font-bold dark:text-white uppercase tracking-tighter text-sm leading-tight">
            City Cruise <br/> International
          </span>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors dark:text-white">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${location.pathname === item.path ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'}`}>
            <div className="flex items-center gap-4">
              <item.icon size={20} />
              <span className="font-heading font-bold text-sm uppercase tracking-widest">{item.name}</span>
            </div>
            <div className={`transition-transform ${location.pathname === item.path ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}><ChevronRight size={14} /></div>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center overflow-hidden border border-brand-blue/20">
            {user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : <User size={18} className="text-brand-blue" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-heading font-bold dark:text-white uppercase tracking-tight truncate">{user?.username || 'Member'}</p>
            <p className="text-[9px] font-mono text-slate-400 uppercase">RC: 9242337</p>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"><LogOut size={14} /> End Session</button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-80 bg-white dark:bg-brand-dark border-r border-slate-100 dark:border-slate-800 z-[50]">
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-brand-dark z-[101] shadow-2xl border-r border-slate-100 dark:border-slate-800 lg:hidden">
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const AppLayout = ({ darkMode, setDarkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  const isInternalAppPath = ['/dashboard', '/checkout', '/course', '/exam', '/courses', '/exams'].some(path => location.pathname.startsWith(path));
  const isAdminArea = location.pathname.startsWith('/admin');
  const isFocusMode = location.pathname.startsWith('/exam/') || location.pathname.startsWith('/checkout/') || location.pathname.startsWith('/course/');
  const isRightAlignNav = ['/courses', '/exams'].some(path => location.pathname.startsWith(path));
  
  const showGlobalFooter = !isInternalAppPath && !isAdminArea;

  return (
    <div className="relative min-h-screen bg-white dark:bg-brand-dark transition-colors duration-500">
      {/* Network Monitors */}
      <NetworkStatus />
      <OfflineOverlay />

      {!isInternalAppPath && !isAdminArea && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
      
      {isInternalAppPath && !isFocusMode && !isAdminArea && (
        <>
          <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden fixed top-6 z-[120] p-3.5 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-lg border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl text-slate-600 dark:text-white transition-all active:scale-95 ${isRightAlignNav ? 'right-6' : 'left-6'}`}>
            <Menu size={22} />
          </button>
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </>
      )}

      <div className={`${
        (!isInternalAppPath && !isAdminArea) ? "pt-20" : 
        (isFocusMode || isAdminArea) ? "pl-0" : 
        "lg:pl-80"
      }`}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<><Hero /><Features /><Mentors /><Contact /></>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
            <Route path="/checkout/:courseId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/course/:courseId" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
            <Route path="/exam/:courseId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><ExamsHub /></ProtectedRoute>} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </ErrorBoundary>
      </div>

      {showGlobalFooter && (
        <footer className="bg-white dark:bg-brand-dark border-t border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
            <div className="bg-brand-blue rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden group shadow-2xl shadow-brand-blue/20">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6 tracking-tighter leading-none">
                  JOIN THE NEXT <br className="hidden md:block"/>GENERATION OF SERVICE.
                </h2>
                <p className="text-blue-100 text-sm md:text-lg mb-10 max-w-xl mx-auto font-body opacity-90">
                  Secure your future in the logistics and service industry. Access elite fleet training, professional cleaning certifications, and a global career network.
                </p>
                <Link to="/signup" className="inline-flex items-center gap-3 bg-white text-brand-blue px-10 py-5 rounded-2xl font-heading font-bold uppercase text-xs tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl active:scale-95 group/cta">
                  Create Your Free Account 
                  <ArrowRight size={18} className="group-hover/cta:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-brand-dark/20 blur-[100px] rounded-full" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-slate-100 dark:border-slate-800">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                   <img src={logo} alt="City Cruise" className="w-full h-full object-contain scale-110" />
                </div>
                <span className="text-slate-900 dark:text-white font-heading text-xl font-bold tracking-tight uppercase">City Cruise International</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm font-body">
                Leading the standard in elite car hire, corporate logistics, and professional service training across the African Diaspora. Central Business District, FCT Abuja.
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-900 dark:text-white font-heading font-bold uppercase text-[10px] tracking-[0.2em] mb-6">Services</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-brand-blue transition-colors uppercase tracking-widest">Fleet Academy</Link></li>
                <li><Link to="/login" className="text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-brand-blue transition-colors uppercase tracking-widest">Certifications</Link></li>
                <li><Link to="/login" className="text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-brand-blue transition-colors uppercase tracking-widest">Car Fleet Services</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-heading font-bold uppercase text-[10px] tracking-[0.2em] mb-6">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"><Twitter size={18} /></a>
                <a href="#" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"><Linkedin size={18} /></a>
                <a href="#" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"><Github size={18} /></a>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2026 City Cruise Car Fleet & Hire International Ltd. RC: 9242337</p>
            <div className="flex gap-8">
              <a href="#" className="text-slate-400 text-[9px] font-bold uppercase tracking-widest hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 text-[9px] font-bold uppercase tracking-widest hover:text-slate-600 transition-colors">Terms of Service</a>
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