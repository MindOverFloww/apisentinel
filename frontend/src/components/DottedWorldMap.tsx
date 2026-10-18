import React from 'react';

interface DottedWorldMapProps {
  title?: string;
  subtitle?: string;
  offsetBadge?: string;
}

export const DottedWorldMap: React.FC<DottedWorldMapProps> = ({
  title = 'Global Ingestion Nodes',
  subtitle = 'Edge regional distribution',
  offsetBadge = 'Peak: +5h',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="card-title">{title}</div>
          <div className="card-caption">{subtitle}</div>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(0, 0, 0, 0.65)',
            background: 'rgba(0, 0, 0, 0.05)',
            padding: '3px 10px',
            borderRadius: '999px',
          }}
        >
          {offsetBadge}
        </span>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '110px', marginTop: '12px' }}>
        <svg
          viewBox="0 0 320 130"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <filter id="pingGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Stylized Monochrome World Landmasses */}
          {/* North America */}
          <path
            d="M 25 35 Q 38 20, 60 22 T 95 35 T 80 55 T 45 60 Z"
            fill="#121316"
            opacity="0.92"
          />
          {/* South America */}
          <path
            d="M 68 70 Q 82 72, 85 88 T 78 115 T 62 95 Z"
            fill="#121316"
            opacity="0.9"
          />
          {/* Europe & Africa */}
          <path
            d="M 130 25 Q 155 22, 165 32 T 150 48 T 132 40 Z"
            fill="#121316"
            opacity="0.92"
          />
          <path
            d="M 135 52 Q 165 52, 165 75 T 155 105 T 138 85 Z"
            fill="#121316"
            opacity="0.9"
          />
          {/* Asia */}
          <path
            d="M 172 22 Q 220 18, 260 28 T 275 58 T 240 70 T 195 50 T 175 32 Z"
            fill="#121316"
            opacity="0.95"
          />
          {/* Oceania / Australia */}
          <path
            d="M 245 88 Q 275 85, 278 102 T 252 110 Z"
            fill="#121316"
            opacity="0.88"
          />

          {/* Dotted texture matrix overlay */}
          <g opacity="0.12" fill="#0c0d0e">
            {[...Array(14)].map((_, r) =>
              [...Array(30)].map((_, c) => (
                <circle key={`${r}-${c}`} cx={10 + c * 10.5} cy={10 + r * 8.5} r="1" />
              ))
            )}
          </g>

          {/* Location Ping Nodes */}
          {/* Node 1: US-East */}
          <g>
            <circle cx="68" cy="38" r="4" fill="#ffffff" stroke="#0c0d0e" strokeWidth="2" filter="url(#pingGlow)" />
            <text x="68" y="30" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#0c0d0e">US-East</text>
          </g>

          {/* Node 2: Frankfurt */}
          <g>
            <circle cx="145" cy="32" r="4" fill="#ffffff" stroke="#0c0d0e" strokeWidth="2" filter="url(#pingGlow)" />
            <text x="145" y="24" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#0c0d0e">Frankfurt</text>
          </g>

          {/* Node 3: Tokyo */}
          <g>
            <circle cx="262" cy="42" r="4.5" fill="#ffffff" stroke="#0c0d0e" strokeWidth="2.2" filter="url(#pingGlow)" />
            <text x="262" y="34" textAnchor="middle" fontSize="8" fontWeight="800" fill="#0c0d0e">Tokyo</text>
          </g>

          {/* Node 4: Singapore */}
          <g>
            <circle cx="225" cy="72" r="3.5" fill="#ffffff" stroke="#0c0d0e" strokeWidth="1.8" filter="url(#pingGlow)" />
            <text x="225" y="82" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#0c0d0e">Singapore</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DottedWorldMap;
