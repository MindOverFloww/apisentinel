import React, { useState } from 'react';

export interface DayData {
  day: string;
  value: number; // 0 to 100
  label: string;
  kpi: string;
}

interface WeeklyBarChartProps {
  title?: string;
  subtitle?: string;
  data?: DayData[];
  initialActiveIndex?: number;
}

const defaultData: DayData[] = [
  { day: 'Mon', value: 35, label: 'Monday', kpi: '12.4k' },
  { day: 'Tue', value: 50, label: 'Tuesday', kpi: '14.1k' },
  { day: 'Wed', value: 85, label: 'Wednesday', kpi: '16.4k' },
  { day: 'Thu', value: 45, label: 'Thursday', kpi: '11.8k' },
  { day: 'Fri', value: 65, label: 'Friday', kpi: '15.2k' },
  { day: 'Sat', value: 25, label: 'Saturday', kpi: '8.3k' },
  { day: 'Sun', value: 20, label: 'Sunday', kpi: '6.9k' },
];

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
  title = 'Weekly Activity',
  subtitle = 'Request distribution frequency',
  data = defaultData,
  initialActiveIndex = 2,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const activeDay = data[activeIndex] || data[0];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <div className="card-title">{title}</div>
          <div className="card-caption">{subtitle}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {activeDay.kpi}
          </div>
          <div className="card-caption" style={{ marginTop: '2px' }}>
            {activeDay.label}
          </div>
        </div>
      </div>

      {/* Bar visual area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '110px',
          padding: '0 4px',
          gap: '8px',
        }}
      >
        {data.map((item, index) => {
          const isActive = index === activeIndex;
          const heightPercent = Math.max(18, item.value);

          return (
            <div
              key={item.day}
              onClick={() => setActiveIndex(index)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                cursor: 'pointer',
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              {/* Bar track */}
              <div
                style={{
                  width: '6px',
                  height: '80px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    borderRadius: '999px',
                    backgroundColor: isActive ? '#0c0d0e' : 'rgba(255, 255, 255, 0.9)',
                    boxShadow: isActive 
                      ? '0 4px 12px rgba(0, 0, 0, 0.25)' 
                      : '0 2px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>

              {/* Day label and active dot indicator */}
              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isActive && (
                  <div
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#0c0d0e',
                      transition: 'all 0.2s ease',
                    }}
                  />
                )}
                {!isActive && <div style={{ width: '4px', height: '4px' }} />}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#0c0d0e' : 'rgba(0, 0, 0, 0.45)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.day}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyBarChart;
