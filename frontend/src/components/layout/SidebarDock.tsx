import React from 'react';
import { Shield, Activity, Sliders, Sun, Moon, Terminal, Lock } from 'lucide-react';

interface SidebarDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  openPostmanModal: () => void;
}

export const SidebarDock: React.FC<SidebarDockProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  openPostmanModal,
}) => {
  return (
    <aside
      aria-label="Quick Actions Dock"
      className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3.5 py-4 px-2.5 rounded-full glass-icon-dock transition-all duration-300"
    >
      {/* Brand Emblem */}
      <div
        className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md mb-2 cursor-pointer hover:scale-105 transition-transform"
        title="API Sentinel System"
        onClick={() => setActiveTab('overview')}
      >
        <Shield className="w-5 h-5" />
      </div>

      {/* Overview */}
      <button
        onClick={() => setActiveTab('overview')}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 relative ${
          activeTab === 'overview'
            ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
            : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
        }`}
        title="Dashboard Overview"
      >
        <Activity className="w-4 h-4" />
      </button>

      {/* Rules */}
      <button
        onClick={() => setActiveTab('rules')}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
          activeTab === 'rules'
            ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
            : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
        }`}
        title="Detection Rules"
      >
        <Sliders className="w-4 h-4" />
      </button>

      {/* Login / Auth */}
      <button
        onClick={() => setActiveTab('login')}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
          activeTab === 'login'
            ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
            : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
        }`}
        title="Sign In / Role Access"
      >
        <Lock className="w-4 h-4" />
      </button>

      {/* Postman Guide */}
      <button
        onClick={openPostmanModal}
        className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
        title="Postman / cURL Simulation"
      >
        <Terminal className="w-4 h-4" />
      </button>

      <div className="w-4 h-[1px] bg-neutral-300 dark:bg-neutral-700 my-1" />

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode((prev: boolean) => !prev)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
        title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      >
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </aside>
  );
};
