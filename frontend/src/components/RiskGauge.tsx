import React from 'react';

interface RiskGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'light' | 'smoked';
  subLabel?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 130,
  strokeWidth = 9,
  variant = 'smoked',
  subLabel = 'RISK SCORE',
}) => {
  const isSmoked = variant === 'smoked';
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const trackColor = isSmoked ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
  const progressColor = isSmoked ? '#ffffff' : '#09090b';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Centered KPI Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-3xl font-light tracking-tighter ${
              isSmoked ? 'text-white' : 'text-zinc-950'
            }`}
          >
            {score}
          </span>
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold ${
              isSmoked ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            / 100
          </span>
        </div>
      </div>
      {subLabel && (
        <span
          className={`mt-2 text-[10px] tracking-wider uppercase font-semibold ${
            isSmoked ? 'text-zinc-400' : 'text-zinc-600'
          }`}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
};
