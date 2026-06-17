import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  // Dimensions based on size
  const sizes = {
    sm: { svg: 'w-10 h-10', text: 'text-xs', sub: 'text-[7px]' },
    md: { svg: 'w-16 h-16', text: 'text-sm md:text-base', sub: 'text-[9px] md:text-[10px]' },
    lg: { svg: 'w-24 h-24', text: 'text-lg md:text-xl', sub: 'text-[11px] md:text-[12px]' },
    xl: { svg: 'w-32 h-32', text: 'text-2xl md:text-3xl', sub: 'text-[13px] md:text-[14px]' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Dynamic Animated Vector Logo */}
      <div className={`relative ${currentSize.svg} transition-transform hover:scale-105 duration-300`}>
        <svg 
          viewBox="0 0 400 300" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full drop-shadow-md"
        >
          {/* Slanted Stylized "M" in Blue */}
          <path
            d="M 140 220 L 180 60 L 210 60 L 235 145 L 260 60 L 290 60 L 250 220 L 215 220 L 195 155 L 175 220 Z"
            fill="#1E50BA" /* Precise Cobalt Blue from the logo */
            stroke="#1E50BA"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Sweeping Orange Accent Arrow */}
          <path
            d="M 205 160 C 235 150 265 110 320 115 L 305 90 L 340 115 L 305 140 L 310 125 C 265 120 240 155 205 160 Z"
            fill="#E96C20" /* Pure Vibrant Orange from the logo */
            stroke="#E96C20"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="mt-2 text-center">
          <span 
            className={`block font-black tracking-wider text-[#1E50BA] uppercase font-sans ${currentSize.text}`}
            style={{ letterSpacing: '0.15em' }}
          >
            M Delivery
          </span>
          <span className={`block font-extrabold text-[#E96C20] mt-0.5 ${currentSize.sub}`}>
            M لتوصيل الطلبات
          </span>
        </div>
      )}
    </div>
  );
}

// Horizontal variant for headers
export function LogoHorizontal({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { svg: 'w-8 h-8', text: 'text-sm', sub: 'text-[8px]' },
    md: { svg: 'w-12 h-12', text: 'text-base md:text-lg', sub: 'text-[9px] md:text-[10px]' },
    lg: { svg: 'w-16 h-16', text: 'text-lg md:text-xl', sub: 'text-[11px] md:text-[12px]' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-2 text-right select-none ${className}`}>
      {/* Dynamic Animated Vector Logo */}
      <div className={`relative ${currentSize.svg} shrink-0`}>
        <svg 
          viewBox="0 0 400 300" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full drop-shadow-sm"
        >
          {/* Slanted Stylized "M" in Blue */}
          <path
            d="M 140 220 L 180 60 L 210 60 L 235 145 L 260 60 L 290 60 L 250 220 L 215 220 L 195 155 L 175 220 Z"
            fill="#1E50BA"
            stroke="#1E50BA"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Sweeping Orange Accent Arrow */}
          <path
            d="M 205 160 C 235 150 265 110 320 115 L 305 90 L 340 115 L 305 140 L 310 125 C 265 120 240 155 205 160 Z"
            fill="#E96C20"
            stroke="#E96C20"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <span 
          className={`font-black tracking-normal text-white uppercase font-sans ${currentSize.text}`}
        >
          M <span className="text-[#E96C20]">Delivery</span>
        </span>
        <span className={`font-extrabold text-[#E96C20] ${currentSize.sub}`}>
          M لتوصيل الطلبات
        </span>
      </div>
    </div>
  );
}
