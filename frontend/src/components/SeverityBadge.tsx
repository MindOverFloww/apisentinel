import React from 'react';
import { IncidentSeverity } from '../types';

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  switch (severity) {
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-black text-white border border-zinc-700 shadow-sm ${sizeClasses}`}
        >
          Critical
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center font-semibold tracking-wider uppercase rounded-full bg-zinc-800 text-zinc-100 border border-zinc-600 ${sizeClasses}`}
        >
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center font-medium tracking-wider uppercase rounded-full bg-zinc-200 text-zinc-800 border border-zinc-300 ${sizeClasses}`}
        >
          Medium
        </span>
      );
    case 'LOW':
    default:
      return (
        <span
          className={`inline-flex items-center font-normal tracking-wider uppercase rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 ${sizeClasses}`}
        >
          Low
        </span>
      );
  }
};
