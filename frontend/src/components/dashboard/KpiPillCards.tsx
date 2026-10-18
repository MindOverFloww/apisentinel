import React from 'react';
import { ShieldAlert, AlertTriangle, Cpu, CheckCircle2 } from 'lucide-react';

interface KpiPillCardsProps {
  onIncidentFilter?: (severity: string) => void;
}

export const KpiPillCards: React.FC<KpiPillCardsProps> = ({ onIncidentFilter }) => {
  const kpis = [
    {
      id: 'kpi-1',
      title: 'Monitored Requests',
      value: '142.8k',
      caption: 'Continuous live event pipeline',
      icon: Cpu,
      isDark: false,
      tag: '+8.4% today',
    },
    {
      id: 'kpi-2',
      title: 'Open Security Incidents',
      value: '04',
      caption: 'Requires analyst triage',
      icon: AlertTriangle,
      isDark: true,
      tag: 'Critical Alert',
    },
    {
      id: 'kpi-3',
      title: 'Peak Risk Score',
      value: '85',
      caption: '0–100 Explainable Severity',
      icon: ShieldAlert,
      isDark: false,
      tag: 'CRITICAL',
    },
    {
      id: 'kpi-4',
      title: 'Signature Rules Active',
      value: '3 / 3',
      caption: 'Brute, Abuse & SQLi online',
      icon: CheckCircle2,
      isDark: true,
      tag: '100% Health',
    },
  ];

  return (
    <>
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            onClick={() => onIncidentFilter?.(kpi.tag)}
            className={`p-5 flex flex-col justify-between col-span-1 cursor-pointer ${
              kpi.isDark ? 'glass-dark' : 'glass-light'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  kpi.isDark ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {kpi.title}
              </span>
              <div
                className={`p-1.5 rounded-xl ${
                  kpi.isDark
                    ? 'bg-white/10 text-white'
                    : 'bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2">
              <span
                className={`text-3xl md:text-4xl font-light tracking-tight block ${
                  kpi.isDark ? 'text-white' : 'text-neutral-900 dark:text-white'
                }`}
              >
                {kpi.value}
              </span>
              <span
                className={`text-[11px] font-medium block mt-1 ${
                  kpi.isDark ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {kpi.caption}
              </span>
            </div>

            <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  kpi.isDark
                    ? 'bg-white/15 text-white'
                    : 'bg-black/10 dark:bg-white/15 text-neutral-900 dark:text-neutral-100 font-semibold'
                }`}
              >
                {kpi.tag}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  kpi.isDark ? 'text-neutral-400' : 'text-neutral-400'
                }`}
              >
                View
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};
