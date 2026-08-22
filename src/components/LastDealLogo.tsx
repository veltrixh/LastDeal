import React from 'react';

interface LastDealLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const LastDealLogo: React.FC<LastDealLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const iconSizes = {
    sm: 'h-7 w-auto',
    md: 'h-9 w-auto',
    lg: 'h-12 w-auto'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Exact Logo Icon SVG Representation */}
      <svg 
        viewBox="0 0 100 100" 
        className={`${iconSizes[size]} shrink-0`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark 'L' Base */}
        <path 
          d="M 16 12 L 28 12 L 28 72 L 72 72 L 72 84 L 16 84 Z" 
          fill="#0F172A" 
        />
        
        {/* Orange Clock Arc / 'D' Curved Shell */}
        <path 
          d="M 38 14 C 62 14 82 32 82 56 C 82 62 80 67 76 72" 
          stroke="#FF5500" 
          strokeWidth="11" 
          strokeLinecap="round" 
        />

        {/* Clock Hands (Pointing ~ 9 and 12) */}
        <path 
          d="M 42 38 L 42 54 L 58 54" 
          stroke="#0F172A" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Small Clock Ticks */}
        <line x1="42" y1="26" x2="42" y2="30" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="54" x2="72" y2="54" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <line x1="61" y1="35" x2="64" y2="32" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

        {/* Tilted Orange Price Tag Badge at bottom right */}
        <g transform="translate(54, 52) rotate(42)">
          <path 
            d="M 0 0 L 16 0 L 24 8 L 8 24 L 0 16 Z" 
            fill="#FF5500" 
          />
          {/* Hole in tag */}
          <circle cx="7" cy="7" r="2.5" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Wordmark: Last (Dark) Deal (Orange) */}
      {showText && (
        <div className="flex flex-col select-none">
          <span className={`font-display font-extrabold tracking-tight leading-none ${textSizes[size]} text-[#0F172A]`}>
            Last<span className="text-[#FF5500]">Deal</span>
          </span>
          <span className="text-[9px] font-bold tracking-wider uppercase text-[#FF5500] mt-0.5">
            Save Money • Zero Waste
          </span>
        </div>
      )}
    </div>
  );
};
