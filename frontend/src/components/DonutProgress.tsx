import React from 'react';

interface DonutProgressProps {
  percentage: number;
  label?: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  invert?: boolean; // If inside dark glass card
}

export const DonutProgress: React.FC<DonutProgressProps> = ({
  percentage,
  label,
  sublabel,
  size = 72,
  strokeWidth = 5.5,
  invert = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const trackColor = invert ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
  const strokeColor = invert ? '#ffffff' : '#0c0d0e';
  const textColor = invert ? '#ffffff' : '#0c0d0e';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        {/* Centered Percentage */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size > 90 ? '22px' : '15px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: textColor,
          }}
        >
          {percentage}%
        </div>
      </div>

      {label && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '11px',
            fontWeight: 600,
            color: textColor,
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </div>
      )}
      {sublabel && (
        <div
          style={{
            fontSize: '9.5px',
            fontWeight: 400,
            color: invert ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
            marginTop: '1px',
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};

export default DonutProgress;
