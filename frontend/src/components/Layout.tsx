import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Sliders,
  Cpu,
  ShieldCheck,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allNavItems = [
    { to: '/overview', label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
    { to: '/incidents', label: 'Incidents', icon: ShieldAlert, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
    { to: '/traffic', label: 'Traffic', icon: Activity, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
    { to: '/rules', label: 'Rules', icon: Sliders, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
    { to: '/users', label: 'Users', icon: UserIcon, roles: ['ADMIN'] },
  ];

  const currentRole = user?.role || 'VIEWER';
  const navItems = allNavItems.filter((item) => item.roles.includes(currentRole));

  return (
    <div className="relative min-h-screen flex flex-col antialiased">
      {/* Top Header Glass Strip */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-white/60 bg-white/35 backdrop-blur-[24px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-black flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-zinc-950">
              API SENTINEL
            </span>
            <span className="ml-2.5 text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/5 border border-black/10 text-zinc-700">
              IDS ACTIVE
            </span>
          </div>
        </div>

        {/* User Pill & Logout Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md">
            <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight text-zinc-900 capitalize">
                {user?.username || 'Guest Operator'}
              </div>
              <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                {currentRole} • ROLE
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-full bg-white/60 hover:bg-white border border-white/80 text-zinc-600 hover:text-black transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body with Slim Left Dock and Page Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-6 gap-3 sm:gap-6">
        {/* Left Slim Vertical Icon Dock */}
        <aside className="shrink-0 flex flex-col items-center py-4 sm:py-6 px-1.5 sm:px-3 rounded-[24px] sm:rounded-[28px] bg-white/40 border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-[26px] h-fit sticky top-24 gap-3 sm:gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) => `w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-black text-white shadow-lg shadow-black/20 scale-105'
                    : 'text-zinc-600 hover:text-black hover:bg-white/60'
                }`}
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            );
          })}
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default Layout;
