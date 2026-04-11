import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronRight, X, User,
  Calendar, CreditCard, Edit3, Ban, CheckCircle2, RefreshCcw, KeyRound
} from 'lucide-react';
import { useAdminStore } from '../context/adminStore';
import ConfirmationModal from '../components/ConfirmationModal';
import { adminUpdateUser } from '../api/adminService';

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [editRole, setEditRole] = useState('student');
  const [newPassword, setNewPassword] = useState('');

  const { students, toggleUserStatus, fetchStudents, isLoading } = useAdminStore();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, isProfileOpen]);

  useEffect(() => {
  if (selectedUser) {
    setEditRole(selectedUser.role || 'student');
  }
}, [selectedUser]);

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    const userId = selectedUser.id;
    const targetStatus = !selectedUser.isActive;
    await toggleUserStatus(userId, targetStatus);

    setSelectedUser(prev => ({
      ...prev,
      isActive: targetStatus
    }));
    setIsConfirmOpen(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);

    const updateData = {
      role: editRole
    };

    if (newPassword) {
      updateData.password = newPassword;
    }

    const result = await adminUpdateUser(selectedUser.id, updateData);

    if (result.success) {
      setIsProfileLoading(false)
      setIsProfileOpen(false);
      setNewPassword('');
    } else {
      alert(result.message);
    }
  };

  const filteredStudents = students || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 px-4 md:px-0">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 ring-brand-blue/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              fetchStudents(val);
            }}
          />
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={16} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="p-20 flex justify-center"><RefreshCcw className="animate-spin text-brand-blue" size={32} /></div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Student</th>
                    <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</th>
                    <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined</th>
                    <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs uppercase">
                            {user.username?.charAt(0) || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{user.username}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-sm font-medium">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {user.isActive !== false ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="p-5">{user.role}</td>
                      <td className="p-5 text-sm text-slate-500 font-medium">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recent'}
                      </td>
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

            <div className="md:hidden divide-y divide-slate-100">
              {filteredStudents.map((user) => (
                <div
                  key={user.id}
                  onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                  className="p-4 active:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-brand-blue font-bold text-sm uppercase shrink-0 border border-slate-100">
                      {user.username?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.isActive !== false ? 'Active' : 'Banned'}</p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-mono text-xs uppercase tracking-widest">No matching students found.</div>
            )}
          </>
        )}
      </div>

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
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[151] shadow-2xl p-6 md:p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 md:mb-10">
                <h3 className="text-xl font-bold text-slate-900">User Intelligence</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <div className="flex flex-col items-center mb-8 md:mb-10">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-blue mb-4 border border-slate-100 shadow-inner">
                  <User size={40} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 text-center">{selectedUser.username}</h4>
                <p className="text-slate-400 text-sm break-all text-center px-4">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 md:mb-10">
                <div className="p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Courses</p>
                  <p className="text-xl font-black text-slate-900">{selectedUser.courses || 0}</p>
                </div>
                <div className="p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Spent</p>
                  <p className="text-xl font-black text-slate-900">${selectedUser.spent || 0}</p>
                </div>
              </div>

              <div className="space-y-6 px-2">
                <div className="flex items-center gap-4 text-slate-500">
                  <Calendar size={18} />
                  <span className="text-xs md:text-sm font-medium">Joined {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) : 'Recent'}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <CreditCard size={18} />
                  <span className="text-xs md:text-sm font-medium">Tier: Standard Access</span>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 mt-auto space-y-3">
                <button onClick={() => setIsProfileOpen(true)} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  <Edit3 size={16} /> Edit Profile
                </button> 
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${selectedUser.isActive === false ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  {selectedUser.isActive === false ? <><CheckCircle2 size={16} /> Activate Access</> : <><Ban size={16} /> Restrict Access</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Identity Sidebar */}
      <AnimatePresence>
        {isProfileOpen && selectedUser && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl border border-white/10"
            >
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-brand-blue">
                <X size={24} />
              </button>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Change Role</label>
                  <select value={editRole} name="role" id="role" onChange={(e) => setEditRole(e.target.value)} className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] outline-none focus:ring-4 ring-brand-blue/10 dark:text-white text-base font-bold transition-all">
                    <option>Switch role</option>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <KeyRound size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Change Password</span>
                  </div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] outline-none dark:text-white text-sm focus:ring-4 ring-brand-blue/10"
                  />
                </div>

                <button type="submit" disabled={isProfileLoading} className="w-full bg-brand-blue text-white py-5 rounded-[1.5rem] font-bold uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-brand-blue/30 hover:bg-blue-600 transition-all">
                  {isProfileLoading ? "Updating..." : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleToggleStatus}
        title={selectedUser?.isActive === false ? "Reactivate User?" : "Restrict Access?"}
        message={selectedUser?.isActive === false ? `You are about to restore full access for ${selectedUser?.username}.` : `You are about to ban ${selectedUser?.username}. They will no longer be able to access their courses.`}
        confirmText={selectedUser?.isActive === false ? "Restore Access" : "Restrict Now"}
        type={selectedUser?.isActive === false ? 'warning' : 'danger'}
      />
    </motion.div>
  );
};

export default AdminUserManagement;