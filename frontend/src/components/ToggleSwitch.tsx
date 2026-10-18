import React from 'react';

interface ToggleSwitchProps {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  invert?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  sublabel,
  checked,
  onChange,
  invert = true,
}) => {
  const textColor = invert ? '#ffffff' : '#121316';
  const mutedColor = invert ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 0',
        userSelect: 'none',
      }}
    >
      <div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: textColor, letterSpacing: '-0.01em' }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '10px', color: mutedColor, marginTop: '1px' }}>
            {sublabel}
          </div>
        )}
      </div>

      <div
        onClick={() => onChange(!checked)}
        className={`pill-toggle ${checked ? 'checked' : ''}`}
        style={{
          width: '38px',
          height: '20px',
          borderRadius: '999px',
          backgroundColor: checked
            ? (invert ? '#ffffff' : '#0c0d0e')
            : (invert ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.14)'),
          position: 'relative',
          cursor: 'pointer',
          border: '1px solid',
          borderColor: checked
            ? (invert ? '#ffffff' : '#0c0d0e')
            : (invert ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.2)'),
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: checked
              ? (invert ? '#121316' : '#ffffff')
              : '#ffffff',
            position: 'absolute',
            top: '2px',
            left: checked ? '20px' : '3px',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
          }}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;
