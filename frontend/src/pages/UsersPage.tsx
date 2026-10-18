import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Mail, Calendar, UserPlus, RefreshCw, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UserRecord {
  id: number;
  username: string;
  role: string;
  email?: string;
  createdAt?: string;
}

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER'>('ANALYST');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 3500);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch users from backend', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newPassword) {
      showToast('Please fill all required fields', true);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.createUser({
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });

      showToast(`User '${newUsername}' created with role ${newRole}`);
      setIsModalOpen(false);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('ANALYST');
      await fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to create user', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-black text-white dark:bg-white dark:text-black';
      case 'ANALYST':
        return 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900';
      case 'VIEWER':
      default:
        return 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-28 pt-6 px-4 sm:px-6 lg:px-8 animate-fade-slide">
      {/* Toast Notifications */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold shadow-2xl animate-fade-slide">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-2xl animate-fade-slide">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              Identity & Access Management (IAM)
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-400" />
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Admin Exclusive
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-neutral-900 dark:text-white leading-tight">
            User Accounts
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Manage authenticated console accounts and role assignments across PostgreSQL and Spring Security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-medium shadow-md hover:opacity-85 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New User</span>
          </button>

          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-full glass-light hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors"
            title="Refresh Users"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Total Users
            </span>
            <span className="text-3xl font-light text-neutral-900 dark:text-white mt-1 block">
              {users.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Admins
            </span>
            <span className="text-3xl font-light text-neutral-900 dark:text-white mt-1 block">
              {users.filter((u) => u.role === 'ADMIN').length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Analysts & Viewers
            </span>
            <span className="text-3xl font-light text-neutral-900 dark:text-white mt-1 block">
              {users.filter((u) => u.role !== 'ADMIN').length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
            <Key className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-light rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">
            Registered System Users
          </h2>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            PostgreSQL: api_sentinel.users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">ID</th>
                <th className="pb-3 px-3">Username</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Account Status</th>
                <th className="pb-3 px-3">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    Loading users from PostgreSQL...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    No users found in database.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-3 font-mono text-neutral-400">
                      #{u.id}
                    </td>
                    <td className="py-4 px-3 font-medium text-neutral-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-[11px]">
                          {u.username.charAt(0).toUpperCase()}
                        </span>
                        <span>{u.username}</span>
                        {u.username === currentUser?.username && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider ${getRoleBadgeStyle(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-3 font-mono text-neutral-500 dark:text-neutral-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleString() : 'System Default'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="glass-light border border-black/10 dark:border-white/15 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-fade-slide">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light tracking-tight text-neutral-900 dark:text-white">
                Create User Account
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. sec_auditor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="auditor@apisentinel.local"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Assigned Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white focus:outline-hidden"
                >
                  <option value="ADMIN">ADMIN (Full Control)</option>
                  <option value="ANALYST">ANALYST (Triage & Investigate)</option>
                  <option value="VIEWER">VIEWER (Read-Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
