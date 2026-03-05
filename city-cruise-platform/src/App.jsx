import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, Award, X, Menu, LogOut, ChevronRight, User, ShieldCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Mentors from './components/Mentors';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import Checkout from './pages/Checkout';
import CoursePlayer from './pages/CoursePlayer';
import ExamPage from './pages/ExamPage';
import ExamsHub from './pages/ExamsHub';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminLogin from './pages/AdminLogin'; 
import { useAuthStore } from './context/authstore';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// STUDENT ROUTE GUARD
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ADMIN ROUTE GUARD
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
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Exams', path: '/exams', icon: Award },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
          <span className="font-heading font-bold dark:text-white uppercase tracking-tighter">Navigator</span>
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
            <p className="text-xs font-heading font-bold dark:text-white uppercase tracking-tight truncate">{user?.firstName || 'Innovator'}</p>
            <p className="text-[9px] font-mono text-slate-400 uppercase">Premium Member</p>
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
  
  const isMinimalUI = ['/dashboard', '/checkout', '/course', '/exam', '/courses', '/exams'].some(path => location.pathname.startsWith(path));
  const isAdminArea = location.pathname.startsWith('/admin');
  const isFocusMode = location.pathname.startsWith('/exam/') || location.pathname.startsWith('/checkout/');
  const isRightAlignNav = ['/courses', '/exams'].some(path => location.pathname.startsWith(path));

  return (
    <div className="relative min-h-screen bg-white dark:bg-brand-dark transition-colors duration-500">
      {!isMinimalUI && !isAdminArea && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
      
      {isMinimalUI && !isFocusMode && !isAdminArea && (
        <>
          <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden fixed top-6 z-[120] p-3.5 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-lg border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl text-slate-600 dark:text-white transition-all active:scale-95 ${isRightAlignNav ? 'right-6' : 'left-6'}`}>
            <Menu size={22} />
          </button>
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </>
      )}

      <div className={`${
        (!isMinimalUI && !isAdminArea) ? "pt-20" : 
        (isFocusMode || isAdminArea) ? "pl-0" : 
        "lg:pl-80"
      }`}>
        <Routes>
          <Route path="/" element={<><Hero /><Features /><Mentors /><Contact /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* PROTECTED STUDENT ROUTES */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/checkout/:courseId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/course/:courseId" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
          <Route path="/exam/:courseId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
          <Route path="/exams" element={<ProtectedRoute><ExamsHub /></ProtectedRoute>} />

          {/* PROTECTED ADMIN ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>

      {!isMinimalUI && !isAdminArea && (
        <footer className="bg-white dark:bg-[#0B0F1A] border-t border-slate-100 dark:border-slate-800 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-heading text-lg font-bold">C</div>
                <span className="text-slate-900 dark:text-white font-heading text-lg font-bold tracking-tight">City Cruise</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-body">Empowering the African Diaspora through elite mentorship.</p>
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