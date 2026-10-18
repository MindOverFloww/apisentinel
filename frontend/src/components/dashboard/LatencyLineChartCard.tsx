import React from 'react';
import { Gauge, Zap } from 'lucide-react';

export const LatencyLineChartCard: React.FC = () => {
  // Cubic Bezier smooth line coordinates on 400x120 viewBox with NO gridlines
  // Smooth curve through latency data points (values around 20-55ms)
  const smoothCurve = "M 0,85 C 40,80 80,60 120,65 C 160,70 200,30 240,40 C 280,50 320,85 360,75 C 380,70 390,65 400,60";

  return (
    <div className="glass-dark p-6 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-white" />
            <h3 className="text-sm md:text-base font-semibold tracking-normal text-white">
              Response Latency & Engine Overhead
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-300 bg-white/10 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-white" />
            <span>&lt; 2ms Overhead</span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl md:text-4xl font-light tracking-tight text-white">
            38 ms
          </span>
          <span className="text-xs font-semibold text-neutral-300">
            Avg Engine Latency
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">
          Zero-delay asynchronous rule evaluation pipeline during high-throughput requests.
        </p>
      </div>

      {/* Smooth line chart with NO gridlines and minimal axis labels */}
      <div className="mt-5 pt-2">
        <div className="w-full h-24 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
            {/* Smooth line */}
            <path
              d={smoothCurve}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Real-time pulse dot on end */}
            <circle
              cx="400"
              cy="60"
              r="4"
              className="fill-white stroke-2 stroke-neutral-900"
            />
          </svg>
        </div>

        {/* Minimal axis labels */}
        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mt-2 pt-2 border-t border-white/10">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span className="text-white font-semibold">Now (38ms)</span>
        </div>
      </div>
    </div>
  );
};
