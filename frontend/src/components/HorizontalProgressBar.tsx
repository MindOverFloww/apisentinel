import React from 'react';

export interface ProgressItem {
  label: string;
  percentage: number;
}

interface HorizontalProgressBarProps {
  items: ProgressItem[];
  invert?: boolean;
}

export const HorizontalProgressBar: React.FC<HorizontalProgressBarProps> = ({
  items,
  invert = false,
}) => {
  const textColor = invert ? '#ffffff' : '#121316';
  const mutedColor = invert ? 'rgba(255, 255, 255, 0.55)' : 'rgba(0, 0, 0, 0.48)';
  const trackColor = invert ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)';
  const barColor = invert ? '#ffffff' : '#0c0d0e';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: mutedColor, fontWeight: 500, letterSpacing: '-0.01em' }}>
              {item.label}
            </span>
            <span style={{ fontSize: '11px', color: textColor, fontWeight: 700 }}>
              {item.percentage}%
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '5px',
              borderRadius: '999px',
              backgroundColor: trackColor,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${item.percentage}%`,
                height: '100%',
                borderRadius: '999px',
                backgroundColor: barColor,
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalProgressBar;
