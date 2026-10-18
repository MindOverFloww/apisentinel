import React from 'react';

interface SmoothLineChartProps {
  title?: string;
  subtitle?: string;
  invert?: boolean; // Default true because in the screenshot it's inside a dark card
}

export const SmoothLineChart: React.FC<SmoothLineChartProps> = ({
  title = 'Threat Velocity',
  subtitle = 'Anomaly rate trajectory',
  invert = true,
}) => {
  // SVG viewBox coordinates: 0 0 240 100
  // Smooth bezier curve path
  const pathD = 'M 10 82 Q 40 78, 65 65 T 120 50 T 175 32 T 225 15';
  const areaD = `${pathD} L 225 95 L 10 95 Z`;

  const textColor = invert ? '#ffffff' : '#0c0d0e';
  const mutedColor = invert ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <div className="card-title" style={{ color: textColor }}>{title}</div>
        <div className="card-caption" style={{ color: mutedColor }}>{subtitle}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', position: 'relative' }}>
        {/* Minimal Y-axis labels */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '85px',
            fontSize: '9.5px',
            color: mutedColor,
            fontWeight: 500,
            paddingRight: '4px',
            userSelect: 'none',
          }}
        >
          <span>+90%</span>
          <span>+40%</span>
          <span>+10%</span>
          <span>-15%</span>
        </div>

        {/* SVG Chart area */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox="0 0 240 100" style={{ width: '100%', height: '85px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="lineFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={invert ? '#ffffff' : '#0c0d0e'} stopOpacity={invert ? '0.2' : '0.1'} />
                <stop offset="100%" stopColor={invert ? '#ffffff' : '#0c0d0e'} stopOpacity="0" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={invert ? '#ffffff' : '#000000'} floodOpacity={invert ? '0.35' : '0.15'} />
              </filter>
            </defs>

            {/* Area Fill */}
            <path d={areaD} fill="url(#lineFillGrad)" />

            {/* Glowing Smooth Line */}
            <path
              d={pathD}
              fill="none"
              stroke={invert ? '#ffffff' : '#0c0d0e'}
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glowEffect)"
            />

            {/* Endpoint Dot */}
            <circle cx="225" cy="15" r="3.5" fill={invert ? '#ffffff' : '#0c0d0e'} />
          </svg>

          {/* Minimal X-axis labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: '10px',
              paddingRight: '12px',
              marginTop: '4px',
              fontSize: '9.5px',
              color: mutedColor,
              fontWeight: 500,
            }}
          >
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmoothLineChart;
