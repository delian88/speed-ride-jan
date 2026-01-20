
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12 w-auto" }) => {
  return (
    <svg 
      viewBox="0 0 500 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="flameGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>

      {/* Car Silhouette Outline */}
      <path 
        d="M150 180 C 180 150, 300 100, 420 180" 
        stroke="black" 
        strokeWidth="10" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M320 135 C 380 110, 430 150, 450 190" 
        stroke="black" 
        strokeWidth="6" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Speedometer Gauge Arc */}
      <path 
        d="M350 250 A 100 100 0 0 1 450 190" 
        stroke="url(#gaugeGradient)" 
        strokeWidth="15" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M400 230 L 450 215" 
        stroke="black" 
        strokeWidth="3" 
      />
      <circle cx="345" cy="255" r="15" fill="black" />
      <path d="M345 255 L 430 185" stroke="black" strokeWidth="8" strokeLinecap="round" />

      {/* Flames */}
      <path 
        d="M20 220 C 60 210, 80 190, 160 210 C 140 225, 120 235, 160 250 C 100 260, 60 280, 20 240 C 40 240, 50 230, 20 220Z" 
        fill="url(#flameGradient)" 
      />
      <path 
        d="M100 190 C 140 185, 180 190, 280 190" 
        stroke="url(#flameGradient)" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />

      {/* Main Text: SPEEDRIDE */}
      <text 
        x="180" 
        y="265" 
        fontFamily="Inter, sans-serif" 
        fontWeight="900" 
        fontSize="54" 
        fill="black" 
        letterSpacing="-2"
      >
        SPEEDRIDE
      </text>

      {/* Curved Text: Core Fusion */}
      <path id="curve" d="M150 280 C 200 350, 350 350, 460 260" fill="none" />
      <text fill="#94A3B8" fontWeight="800" fontSize="32" fontFamily="Inter, sans-serif" letterSpacing="2">
        <textPath href="#curve" startOffset="5%">
          Core Fusion
        </textPath>
      </text>
    </svg>
  );
};

export default Logo;
