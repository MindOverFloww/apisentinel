import React from 'react';
import { ShieldCheck, Radio, ArrowUpRight } from 'lucide-react';

interface HeroThreatShieldCardProps {
  onInvestigateClick?: () => void;
  totalEvents?: number;
  totalIncidents?: number;
  openIncidents?: number;
  criticalAndHigh?: number;
  sqliCount?: number;
}

export const HeroThreatShieldCard: React.FC<HeroThreatShieldCardProps> = ({
  onInvestigateClick,
  totalEvents = 0,
  totalIncidents = 0,
  openIncidents = 0,
  criticalAndHigh = 0,
  sqliCount = 0,
}) => {
  // Dynamically compute Safe Index based on ratio of total requests vs detected incidents
  const percentage = totalEvents === 0
    ? 100
    : Math.max(10, Math.min(100, Math.round(100 - (totalIncidents / Math.max(totalEvents, 1)) * 100)));

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Dynamic mitigation verdict
  const verdict = openIncidents === 0
    ? 'Optimal Defense'
    : criticalAndHigh > 0
    ? 'High Alert Defense'
    : 'Active Triage';

  return (
    <div className="glass-dark p-6 md:p-7 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2 row-span-2 relative overflow-hidden group">
      {/* Background ambient radial glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-300">
              Sentinel Core Status
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-white">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Rule Engine Online</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
          Intrusion Detection Shield
        </h2>
        <p className="text-xs md:text-sm text-neutral-400 font-light max-w-md leading-relaxed">
          Autonomous real-time inspection of HTTP verbs, query parameters, payloads, and authentication velocities across all monitored demo routes.
        </p>
      </div>

      {/* Center Donut Gauge */}
      <div className="my-6 py-4 flex flex-col sm:flex-row items-center justify-around gap-6 bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#ffffff"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extralight tracking-tight text-white">{percentage}%</span>
            <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">Safe Index</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-left w-full sm:w-auto">
          <div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">Mitigation Verdict</div>
            <button
              type="button"
              onClick={onInvestigateClick}
              className="text-base font-medium text-white flex items-center gap-1.5 mt-0.5 hover:underline cursor-pointer"
            >
              <span>{verdict}</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
          <div className="w-full h-[1px] bg-white/10" />
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Unresolved</div>
              <div className="text-lg font-light text-white">{openIncidents} Incidents</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Rule Latency</div>
              <div className="text-lg font-light text-white">&lt; 1.4 ms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom KPI row */}
      <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
        <div className="p-2.5 rounded-xl bg-white/[0.04]">
          <span className="text-[11px] text-neutral-400 font-medium block">Monitored</span>
          <span className="text-lg md:text-xl font-light text-white">{totalEvents}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.04]">
          <span className="text-[11px] text-neutral-400 font-medium block">Anomalous</span>
          <span className="text-lg md:text-xl font-light text-white">{totalIncidents}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.04]">
          <span className="text-[11px] text-neutral-400 font-medium block">Flagged SQLi</span>
          <span className="text-lg md:text-xl font-light text-white">{sqliCount}</span>
        </div>
      </div>
    </div>
  );
};
