import React from 'react';

interface HedefIsLogoProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function HedefIsLogo({ size = 28, showText = true, className = '' }: HedefIsLogoProps) {
  const gradientId = React.useId();

  const numericSize = typeof size === 'number' 
    ? size 
    : size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 48;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={numericSize}
        height={numericSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="4"
            y1="28"
            x2="28"
            y2="4"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#eb5fa6" />
            <stop offset="1" stopColor="#7d92ff" />
          </linearGradient>
        </defs>
        <rect x="4" y="13" width="5.5" height="15" rx="2.75" fill={`url(#${gradientId})`} />
        <rect x="22.5" y="4" width="5.5" height="24" rx="2.75" fill={`url(#${gradientId})`} />
        <path
          d="M8.5 22.5 23.5 11"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className="text-[19px] font-extrabold tracking-[-0.02em] text-[#f5f6f8]">
          Hedef İş
        </span>
      )}
    </div>
  );
}
