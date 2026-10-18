import React from 'react';

interface MountainAreaChartProps {
  title?: string;
  subtitle?: string;
}

export const MountainAreaChart: React.FC<MountainAreaChartProps> = ({
  title = 'API Throughput VS Latency',
  subtitle = 'Peak concurrency distribution',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <div className="card-title">{title}</div>
        <div className="card-caption">{subtitle}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginTop: '16px' }}>
        {/* Y Axis */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '95px',
            fontSize: '9.5px',
            color: 'rgba(0, 0, 0, 0.45)',
            fontWeight: 500,
            paddingBottom: '16px',
            userSelect: 'none',
          }}
        >
          <span>21:00</span>
          <span>18:00</span>
          <span>15:00</span>
          <span>12:00</span>
          <span>9:00</span>
        </div>

        {/* Mountain Silhouette SVG */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', width: '100%', height: '95px' }}>
            <svg
              viewBox="0 0 320 110"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="mountainDarkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#141518" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#2a2c33" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                </linearGradient>

                <linearGradient id="mountainBackGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a4d56" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Background mountain silhouette */}
              <path
                d="M 10 110 L 10 80 Q 40 50, 75 60 T 140 30 T 210 65 T 280 40 L 310 70 L 310 110 Z"
                fill="url(#mountainBackGrad)"
              />

              {/* Foreground primary dark mountain peaks */}
              <path
                d="M 5 110 L 5 88 Q 35 85, 65 55 T 100 12 T 140 70 T 190 8 T 240 60 T 290 85 L 315 90 L 315 110 Z"
                fill="url(#mountainDarkGrad)"
              />

              {/* Crisp top outline stroke */}
              <path
                d="M 5 88 Q 35 85, 65 55 T 100 12 T 140 70 T 190 8 T 240 60 T 290 85 L 315 90"
                fill="none"
                stroke="#121316"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* X Axis Percentage ticks */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: '10px',
              paddingRight: '10px',
              marginTop: '6px',
              fontSize: '9.5px',
              color: 'rgba(0, 0, 0, 0.45)',
              fontWeight: 500,
            }}
          >
            <span>30%</span>
            <span>40%</span>
            <span>50%</span>
            <span>60%</span>
            <span>70%</span>
            <span>80%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MountainAreaChart;
