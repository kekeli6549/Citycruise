import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronRight, X, User, 
  Calendar, CreditCard, Edit3, Ban, CheckCircle2 
} from 'lucide-react';

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: "Kwame Mensah", email: "kwame@example.com", status: "Active", joined: "Oct 12, 2025", courses: 4, spent: "$1,200" },
    { id: 2, name: "Amara Oke", email: "amara.o@domain.com", status: "Active", joined: "Nov 05, 2025", courses: 2, spent: "$598" },
    { id: 3, name: "Zaidu Yusuf", email: "z.yusuf@web.com", status: "Banned", joined: "Jan 20, 2026", courses: 1, spent: "$399" },
    { id: 4, name: "Chinua Achebe", email: "chinua@pro.com", status: "Active", joined: "Feb 02, 2026", courses: 7, spent: "$3,450" },
  ]);

  const toggleBan = (id) => {
    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u
    );
    setUsers(updatedUsers);
    
    // Update the selected user reference so the UI reflects changes immediately
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, status: selectedUser.status === 'Banned' ? 'Active' : 'Banned' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 ring-brand-blue/20 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Student</th>
                <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined</th>
                <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users
                .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-5 text-sm text-slate-500 font-medium">{user.joined}</td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => { setSelectedUser(user); setIsModalOpen(true); }} 
                      className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-brand-blue transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Drawer */}
      <AnimatePresence>
        {isModalOpen && selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)} 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[151] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-slate-900">User Intelligence</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-10">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-blue mb-4 border border-slate-100 shadow-inner">
                  <User size={40} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h4>
                <p className="text-slate-400 text-sm">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Courses</p>
                  <p className="text-xl font-black text-slate-900">{selectedUser.courses}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Spent</p>
                  <p className="text-xl font-black text-slate-900">{selectedUser.spent}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-500">
                   <Calendar size={18} />
                   <span className="text-sm font-medium">Joined {selectedUser.joined}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                   <CreditCard size={18} />
                   <span className="text-sm font-medium">Subscription: Premium Tier</span>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 mt-auto space-y-3">
                <button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  <Edit3 size={16} /> Edit Profile
                </button>
                <button 
                  onClick={() => toggleBan(selectedUser.id)} 
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                    selectedUser.status === 'Banned' 
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  {selectedUser.status === 'Banned' ? (
                    <><CheckCircle2 size={16} /> Activate Access</>
                  ) : (
                    <><Ban size={16} /> Restrict Access</>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUserManagement;