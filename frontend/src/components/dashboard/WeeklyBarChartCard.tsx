import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { WEEKLY_CHART_DATA } from '../../services/mockData';

export const WeeklyBarChartCard: React.FC = () => {
  const [metricMode, setMetricMode] = useState<'requests' | 'threats'>('requests');

  return (
    <div className="glass-light p-6 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            <h3 className="text-sm md:text-base font-semibold tracking-normal text-neutral-900 dark:text-white">
              Weekly Traffic Volume
            </h3>
          </div>

          {/* Metric toggle pill */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-full p-0.5">
            <button
              onClick={() => setMetricMode('requests')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${
                metricMode === 'requests'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setMetricMode('threats')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${
                metricMode === 'threats'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Threats
            </button>
          </div>
        </div>

        {/* Large Numeric KPI */}
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 dark:text-white">
            {metricMode === 'requests' ? '28,420' : '580'}
          </span>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            +14.2% vs avg
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
          Peak API traffic observed during unauthenticated demo authentication spikes.
        </p>
      </div>

      {/* Weekly Bar Chart with rounded-cap bars and active day in black */}
      <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10">
        <div className="h-36 flex items-end justify-between gap-2 px-1">
          {WEEKLY_CHART_DATA.map((item) => {
            const height = metricMode === 'requests' ? item.heightPct : (item.threats / 600) * 100;
            const isActive = item.active;

            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip value on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-neutral-700 dark:text-neutral-200 bg-white/90 dark:bg-black/90 px-1.5 py-0.5 rounded shadow-xs pointer-events-none whitespace-nowrap">
                  {metricMode === 'requests' ? `${(item.requests / 1000).toFixed(1)}k` : item.threats}
                </div>

                {/* Bar */}
                <div className="w-full max-w-[28px] bg-black/10 dark:bg-white/10 h-28 rounded-full overflow-hidden flex items-end">
                  <div
                    style={{ height: `${Math.max(12, height)}%` }}
                    className={`w-full rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-black dark:bg-white shadow-md'
                        : 'bg-neutral-400 dark:bg-neutral-500 hover:bg-neutral-600 dark:hover:bg-neutral-300'
                    }`}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`text-xs transition-colors ${
                    isActive
                      ? 'font-bold text-black dark:text-white'
                      : 'text-neutral-500 dark:text-neutral-400 font-medium'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
