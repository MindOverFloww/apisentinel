import React from 'react';
import { IncidentStatus } from '../types';

interface StatusPillProps {
  status: IncidentStatus;
  variant?: 'light' | 'smoked';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, variant = 'light' }) => {
  const isSmoked = variant === 'smoked';

  switch (status) {
    case 'OPEN':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase ${
            isSmoked
              ? 'bg-white text-zinc-950 border border-white'
              : 'bg-black text-white border border-black'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Open
        </span>
      );
    case 'INVESTIGATING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase ${
            isSmoked
              ? 'bg-zinc-800 text-zinc-200 border border-zinc-600'
              : 'bg-zinc-200/90 text-zinc-800 border border-zinc-300'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Investigating
        </span>
      );
    case 'RESOLVED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-normal tracking-wider uppercase ${
            isSmoked
              ? 'bg-zinc-900/60 text-zinc-400 border border-zinc-700/60'
              : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
          }`}
        >
          Resolved
        </span>
      );
    case 'FALSE_POSITIVE':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-normal tracking-wider uppercase ${
            isSmoked
              ? 'bg-zinc-900/40 text-zinc-500 border border-zinc-800'
              : 'bg-zinc-100/80 text-zinc-400 border border-zinc-200'
          }`}
        >
          False Positive
        </span>
      );
  }
};
