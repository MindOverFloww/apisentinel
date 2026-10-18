import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Incident } from '../../types/sentinel';

interface RiskAreaChartCardProps {
  incidents?: Incident[];
}

export const RiskAreaChartCard: React.FC<RiskAreaChartCardProps> = ({ incidents = [] }) => {
  // Extract real risk scores from incidents (most recent or chronological)
  const scores = incidents.map((i) => i.riskScore || 20);
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

  // Determine peak label
  const peakTag = maxScore >= 75
    ? 'Critical Peak'
    : maxScore >= 50
    ? 'High Peak'
    : maxScore >= 25
    ? 'Moderate Peak'
    : 'Baseline';

  // Compute SVG chart coordinates (viewBox 400x120, where y=10 is score 100, y=110 is score 0)
  // Take last 8 incidents or fill with baseline if few
  const sampleData = scores.length > 0
    ? scores.slice(-8)
    : [10, 15, 20, 25, 20];

  const points = sampleData.map((score, index) => {
    const x = sampleData.length > 1 ? Math.round((index / (sampleData.length - 1)) * 400) : 200;
    const y = Math.max(10, Math.min(110, Math.round(110 - (score / 100) * 95)));
    return { x, y, score };
  });

  // Find index of max point
  const peakPoint = points.reduce(
    (max, p) => (p.score > max.score ? p : max),
    points[0] || { x: 200, y: 55, score: 0 }
  );

  // SVG Area path closing at the bottom
  const linePath = points.length > 0
    ? `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
    : 'M 0,110 L 400,110';
  const areaPath = `${linePath} L 400,120 L 0,120 Z`;

  return (
    <div className="glass-light p-6 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            <h3 className="text-sm md:text-base font-semibold tracking-normal text-neutral-900 dark:text-white">
              Risk Score Velocity
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold tracking-wider uppercase">
            0–100 Scale
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 dark:text-white">
            {maxScore}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/15 text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
            {peakTag}
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
          Max calculated incident severity observed across live detected intrusions.
        </p>
      </div>

      {/* Black Gradient Area Chart */}
      <div className="mt-4 pt-2">
        <div className="w-full h-28 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
                <stop offset="80%" stopColor="#000000" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="areaGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
                <stop offset="80%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill */}
            <path
              d={areaPath}
              className="fill-[url(#areaGradientLight)] dark:fill-[url(#areaGradientDark)] transition-all"
            />

            {/* Stroke Line */}
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-black dark:text-white"
            />

            {/* Peak highlight dot */}
            {points.length > 0 && (
              <circle
                cx={peakPoint.x}
                cy={peakPoint.y}
                r="4.5"
                className="fill-black dark:fill-white stroke-2 stroke-white dark:stroke-black shadow-md"
              />
            )}
          </svg>
        </div>

        {/* Minimal Time labels */}
        <div className="flex justify-between items-center text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-2 pt-1 border-t border-black/5 dark:border-white/10">
          <span>Earliest</span>
          <span>Timeline</span>
          <span className="font-bold text-neutral-800 dark:text-neutral-200">Peak: {maxScore}</span>
          <span>Live</span>
        </div>
      </div>
    </div>
  );
};
