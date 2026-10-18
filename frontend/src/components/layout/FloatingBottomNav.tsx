import React from 'react';
import { Activity, Sliders, Lock, Terminal } from 'lucide-react';

interface FloatingBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openPostmanModal: () => void;
  incidentCount?: number;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  setActiveTab,
  openPostmanModal,
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'rules', label: 'Detection Rules', icon: Sliders },
    { id: 'login', label: 'Sign In', icon: Lock },
  ];

  return (
    <nav
      aria-label="Primary Floating Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[92vw]"
    >
      <div className="glass-pill-nav rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-[1.02]'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-1 hidden sm:block" />

        {/* Postman Simulation Pill Button */}
        <button
          onClick={openPostmanModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs md:text-sm font-medium border border-black/20 dark:border-white/20 text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Postman Demo</span>
        </button>
      </div>
    </nav>
  );
};
