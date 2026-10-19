import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Mail, Calendar, UserPlus, RefreshCw, CheckCircle2, AlertCircle, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UserRecord {
  id: number;
  username: string;
  email?: string;
  role: string;
  createdAt?: string;
}

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newRole, setNewRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER'>('ANALYST');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
      setUsers(data || []);
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
    const trimmedUsername = newUsername.trim();
    const trimmedEmail = newEmail.trim().toLowerCase();
    const trimmedPassword = newPassword.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      showToast('Please fill all required fields', true);
      return;
    }

    if (trimmedUsername.length < 3) {
      showToast('Username must be at least 3 characters', true);
      return;
    }

    if (trimmedPassword.length < 8) {
      showToast('Password must be at least 8 characters', true);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.createUser({
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
        role: newRole,
      });

      showToast(`User '${trimmedUsername}' successfully created with role ${newRole}`);
      setIsModalOpen(false);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setShowPassword(false);
      setNewRole('ANALYST');
      await fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to create user', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    if (userToDelete.username === 'admin') {
      showToast("Cannot delete the default 'admin' account", true);
      setUserToDelete(null);
      return;
    }
    if (userToDelete.username === currentUser?.username) {
      showToast('Cannot delete your own current account session', true);
      setUserToDelete(null);
      return;
    }

    setIsDeleting(true);
    try {
      await apiService.deleteUser(userToDelete.id);
      showToast(`User '${userToDelete.username}' removed successfully`);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', true);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const getRoleBadgeStyle = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-black text-white dark:bg-white dark:text-black border-black/20 dark:border-white/20';
      case 'ANALYST':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'VIEWER':
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-28 pt-6 px-4 sm:px-6 lg:px-8 animate-fade-slide">
      {/* Toast Notifications */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold shadow-2xl animate-fade-slide">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
            Manage authenticated console accounts, email identities, and role assignments across PostgreSQL and Spring Security.
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

      {/* Users Table Card */}
      <div className="glass-light rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, email, role..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
            />
          </div>

          <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            Schema: users &bull; user_roles
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">ID</th>
                <th className="pb-3 px-3">Username</th>
                <th className="pb-3 px-3">Email Address</th>
                <th className="pb-3 px-3">Assigned Role</th>
                <th className="pb-3 px-3">Account Status</th>
                <th className="pb-3 px-3">Created Date</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Loading users from PostgreSQL database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    {searchQuery ? 'No users matching search query.' : 'No users found in database.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.username === currentUser?.username;
                  const isPrimaryAdmin = u.username === 'admin';

                  return (
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
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3 font-mono text-neutral-600 dark:text-neutral-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>{u.email || '—'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider border ${getRoleBadgeStyle(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-neutral-600 dark:text-neutral-400">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-3 font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'System Default'}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => setUserToDelete(u)}
                          disabled={isPrimaryAdmin || isCurrent}
                          title={
                            isPrimaryAdmin
                              ? "Cannot delete the default 'admin' account"
                              : isCurrent
                              ? 'Cannot delete your active account session'
                              : `Delete ${u.username}`
                          }
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-500/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-neutral-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-slide">
          <div className="glass-light border border-black/10 dark:border-white/15 rounded-3xl p-6 sm:p-7 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-light tracking-tight text-neutral-900 dark:text-white mb-2">
              Confirm User Deletion
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mb-5 leading-relaxed">
              Are you sure you want to delete user account <strong className="text-neutral-900 dark:text-white font-mono">{userToDelete.username}</strong> ({userToDelete.email})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Username (min 3 chars)
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. sec_auditor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    maxLength={100}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
