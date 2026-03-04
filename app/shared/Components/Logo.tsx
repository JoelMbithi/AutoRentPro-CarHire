interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ size = 'md', showTagline = true }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'w-9 h-9',
      title: 'text-lg',
      tagline: 'text-[8px]',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-11 h-11',
      title: 'text-xl',
      tagline: 'text-[9px]',
      gap: 'gap-3',
    },
    lg: {
      icon: 'w-14 h-14',
      title: 'text-2xl',
      tagline: 'text-[10px]',
      gap: 'gap-3',
    },
  };

  const s = sizes[size];

  return (
    <a href="/" className={`flex items-center ${s.gap} shrink-0 group`}>
      {/* Hand-drawn style icon */}
      <div className={`${s.icon} relative`}>
        {/* Main circle with hand-drawn feel */}
        <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
          {/* Organic blob shape background */}
          <path
            d="M30 4C45 4 54 13 55 28C56 43 47 55 30 56C13 57 4 45 5 30C6 15 15 4 30 4Z"
            className="fill-gray-900 group-hover:fill-gray-800 transition-colors duration-300"
          />
          
          {/* Warm accent swoosh - hand drawn style */}
          <path
            d="M12 38C16 44 22 48 30 48C38 48 44 44 48 38"
            stroke="url(#warmGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-90"
          />
          
          {/* Stylized 'A' with road/path feel */}
          <path
            d="M30 14L18 42M30 14L42 42M22 34H38"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Small steering wheel detail */}
          <circle
            cx="30"
            cy="28"
            r="4"
            stroke="#F97316"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Tiny road dashes */}
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
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 rounded-full bg-orange-500/0 group-hover:bg-orange-500/10 blur-md transition-all duration-500" />
      </div>

      {/* Brand text with personality */}
      <div className="leading-tight">
        <p className={`${s.title} font-black tracking-tight flex items-baseline`}>
          <span className="text-gray-800">Auto</span>
          <span className="relative">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Rent
            </span>
            {/* Hand-drawn underline */}
            <svg 
              className="absolute -bottom-0.5 left-0 w-full h-1.5 opacity-70" 
              viewBox="0 0 40 6" 
              fill="none"
            >
              <path 
                d="M1 4C8 2 16 1.5 20 2C24 2.5 32 3.5 39 2" 
                stroke="url(#underlineGrad)" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="underlineGrad" x1="1" y1="3" x2="39" y2="3">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="text-gray-800">Pro</span>
        </p>
        
        {showTagline && (
          <p className={`${s.tagline} uppercase tracking-[0.2em] text-gray-400 font-medium mt-0.5 flex items-center gap-1.5`}>
            <span className="inline-block w-3 h-px bg-gradient-to-r from-transparent to-gray-300" />
            Executive Travel
            <span className="inline-block w-3 h-px bg-gradient-to-r from-gray-300 to-transparent" />
          </p>
        )}
      </div>
    </a>
  );
}

// Alternative minimal version
export function LogoMinimal({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <a href="/" className="shrink-0 group">
      <div className={`${sizes[size]} relative`}>
        <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
          <path
            d="M30 4C45 4 54 13 55 28C56 43 47 55 30 56C13 57 4 45 5 30C6 15 15 4 30 4Z"
            className="fill-gray-900 group-hover:fill-gray-800 transition-colors duration-300"
          />
          <path
            d="M12 38C16 44 22 48 30 48C38 48 44 44 48 38"
            stroke="url(#warmGradientMin)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M30 14L18 42M30 14L42 42M22 34H38"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="30" cy="28" r="4" stroke="#F97316" strokeWidth="2" fill="none" />
          <defs>
            <linearGradient id="warmGradientMin" x1="12" y1="38" x2="48" y2="38">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </a>
  );
}

// Horizontal badge version
export function LogoBadge() {
  return (
    <a href="/" className="shrink-0 group inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
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
    </a>
  );
}
