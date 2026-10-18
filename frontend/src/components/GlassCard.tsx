import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'smoked';
  className?: string;
  onClick?: () => void;
  hoverLift?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'light',
  className = '',
  onClick,
  hoverLift = true,
}) => {
  const isSmoked = variant === 'smoked';

  const baseStyles = isSmoked
    ? 'bg-[#222225]/80 text-white border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.22)]'
    : 'bg-white/45 text-zinc-900 border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.04)]';

  const liftStyles = hoverLift
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
    : '';

  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-[26px] backdrop-blur-[24px] p-6 ${baseStyles} ${liftStyles} ${clickableStyles} ${className}`}
    >
      {children}
    </div>
  );
};
