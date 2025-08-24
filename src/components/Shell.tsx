import React from 'react';

interface ShellProps {
  position: { x: number; y: number };
  delay: number;
  isAnimating: boolean;
}

export const Shell: React.FC<ShellProps> = ({ position, delay, isAnimating }) => {
  return (
    <div
      className={`shell ${isAnimating ? 'animate-bounce' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        animationDelay: `${delay}s`,
        animationDuration: isAnimating ? '0.5s' : '3s',
      }}
    >
      {/* Shell inner highlight */}
      <div className="absolute inset-1 rounded-full bg-shell-highlight opacity-60"></div>
      
      {/* Shell texture pattern */}
      <div className="absolute inset-0 rounded-full">
        <svg viewBox="0 0 12 12" className="w-full h-full">
          <defs>
            <radialGradient id={`shell-gradient-${position.x}-${position.y}`} cx="30%" cy="30%">
              <stop offset="0%" stopColor="hsl(var(--shell-highlight))" />
              <stop offset="70%" stopColor="hsl(var(--shell-primary))" />
              <stop offset="100%" stopColor="hsl(var(--shell-shadow))" />
            </radialGradient>
          </defs>
          <circle 
            cx="6" 
            cy="6" 
            r="5" 
            fill={`url(#shell-gradient-${position.x}-${position.y})`}
            stroke="hsl(var(--shell-shadow))"
            strokeWidth="0.5"
          />
          {/* Shell ridges */}
          <path
            d="M2 6 Q6 3 10 6 Q6 9 2 6"
            stroke="hsl(var(--shell-shadow))"
            strokeWidth="0.3"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M3 6 Q6 4 9 6 Q6 8 3 6"
            stroke="hsl(var(--shell-highlight))"
            strokeWidth="0.2"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};