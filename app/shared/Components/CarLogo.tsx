"use client";

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  variant?: 'full' | 'minimal' | 'badge';
  className?: string;
}

export function Logo({ 
  size = 'md', 
  showTagline = true, 
  variant = 'full',
  className = '' 
}: LogoProps) {
  
  // Size configurations with better proportions
  const sizes = {
    sm: {
      icon: 'w-8 h-8 md:w-9 md:h-9',
      title: 'text-lg md:text-xl',
      tagline: 'text-[10px]',
      gap: 'gap-2 md:gap-2.5',
      spacing: 'space-y-0.5',
    },
    md: {
      icon: 'w-10 h-10 md:w-11 md:h-11',
      title: 'text-xl md:text-2xl',
      tagline: 'text-[10px] md:text-[11px]',
      gap: 'gap-2.5 md:gap-3',
      spacing: 'space-y-1',
    },
    lg: {
      icon: 'w-12 h-12 md:w-14 md:h-14',
      title: 'text-2xl md:text-3xl',
      tagline: 'text-[11px] md:text-xs',
      gap: 'gap-3 md:gap-4',
      spacing: 'space-y-1',
    },
  };

  const s = sizes[size];

  // Render different variants
  if (variant === 'minimal') {
    return (
      <Link href="/" className={`shrink-0 group ${className}`}>
        <div className={`${s.icon} relative transition-transform duration-300 hover:scale-105`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            {/* Organic blob with subtle gradient */}
            <path
              d="M30 4C45 4 54 13 55 28C56 43 47 55 30 56C13 57 4 45 5 30C6 15 15 4 30 4Z"
              className="fill-gray-900 group-hover:fill-gray-800 transition-all duration-500"
            />
            {/* Warm accent line */}
            <path
              d="M12 38C16 44 22 48 30 48C38 48 44 44 48 38"
              stroke="url(#warmGradientMin)"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-90"
            />
            {/* Stylized 'A' */}
            <path
              d="M30 14L18 42M30 14L42 42M22 34H38"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Steering wheel detail */}
            <circle
              cx="30"
              cy="28"
              r="4"
              stroke="#F97316"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="warmGradientMin" x1="12" y1="38" x2="48" y2="38">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </Link>
    );
  }

  if (variant === 'badge') {
    return (
      <Link href="/" className={`shrink-0 group inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 ${className}`}>
        <svg viewBox="0 0 60 60" className="w-6 h-6" fill="none">
          <path
            d="M30 14L18 42M30 14L42 42M22 34H38"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="30" cy="28" r="4" stroke="#F97316" strokeWidth="2" fill="none" />
        </svg>
        <span className="text-white font-bold text-sm tracking-tight">
          Auto<span className="text-orange-400">Rent</span>Pro
        </span>
      </Link>
    );
  }

  // Full logo (default)
  return (
    <Link href="/" className={`flex items-center ${s.gap} shrink-0 group ${className}`}>
      {/* Icon with hover animation */}
      <div className={`${s.icon} relative transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3`}>
        {/* Main icon */}
        <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
          {/* Base shape with depth */}
          <path
            d="M30 4C45 4 54 13 55 28C56 43 47 55 30 56C13 57 4 45 5 30C6 15 15 4 30 4Z"
            className="fill-gray-900 group-hover:fill-gray-800 transition-all duration-500"
          />
          
          {/* Animated accent swoosh */}
          <path
            d="M12 38C16 44 22 48 30 48C38 48 44 44 48 38"
            stroke="url(#warmGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-90 group-hover:opacity-100 transition-opacity"
          />
          
          {/* Stylized 'A' - the road */}
          <path
            d="M30 14L18 42M30 14L42 42M22 34H38"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Steering wheel - subtle animation */}
          <circle
            cx="30"
            cy="28"
            r="4"
            stroke="#F97316"
            strokeWidth="2"
            fill="none"
            className="group-hover:animate-spin-slow"
          />
          
          {/* Road lines */}
          <path
            d="M30 36L30 38"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          <defs>
            <linearGradient id="warmGradient" x1="12" y1="38" x2="48" y2="38">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/0 blur-xl transition-all duration-700" />
      </div>

      {/* Brand text with improved typography */}
      <div className={`${s.spacing}`}>
        <p className={`${s.title} font-black tracking-tight flex items-baseline`}>
          <span className="text-gray-900">Auto</span>
          <span className="relative">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Rent
            </span>
            {/* Animated underline */}
            <svg 
              className="absolute -bottom-1 left-0 w-full h-1.5 opacity-70 group-hover:opacity-100 transition-opacity" 
              viewBox="0 0 40 6" 
              fill="none"
            >
              <path 
                d="M1 4C8 2 16 1.5 20 2C24 2.5 32 3.5 39 2" 
                stroke="url(#underlineGrad)" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="group-hover:stroke-[3] transition-all"
              />
              <defs>
                <linearGradient id="underlineGrad" x1="1" y1="3" x2="39" y2="3">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="text-gray-900">Pro</span>
        </p>
        
        {showTagline && (
          <p className={`${s.tagline} uppercase tracking-wider text-gray-400 font-medium flex items-center gap-2 group-hover:text-gray-500 transition-colors`}>
            <span className="inline-block w-4 h-px bg-gradient-to-r from-transparent to-gray-300 group-hover:to-orange-300 transition-all" />
            <span className="relative">
              Executive Travel
              <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-orange-400 transition-all duration-700" />
            </span>
            <span className="inline-block w-4 h-px bg-gradient-to-l from-transparent to-gray-300 group-hover:to-orange-300 transition-all" />
          </p>
        )}
      </div>
    </Link>
  );
}

// Pre-configured variants for easy use
export const LogoFull = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="full" />
);

export const LogoMinimal = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="minimal" />
);

export const LogoBadge = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="badge" />
);

// Default export for backward compatibility
export default Logo;