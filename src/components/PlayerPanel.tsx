import React from 'react';

interface PlayerPanelProps {
  player: 1 | 2;
  score: number;
  isActive: boolean;
  className?: string;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  player,
  score,
  isActive,
  className = '',
}) => {
  return (
    <div className={`player-indicator ${isActive ? 'active' : ''} ${className}`}>
      {/* Player Avatar */}
      <div className="score-bowl mb-4">
        <div className="text-2xl font-bold text-gold-primary">
          {player}
        </div>
      </div>
      
      {/* Player Name */}
      <h3 className="text-xl font-semibold mb-2">
        Player {player}
      </h3>
      
      {/* Score Display */}
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Captured Shells</div>
        <div className="text-3xl font-bold text-gold-primary">
          {score}
        </div>
      </div>
      
      {/* Active Player Indicator */}
      {isActive && (
        <div className="mt-4">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-active-glow to-transparent rounded-full animate-pulse"></div>
          <div className="text-sm text-active-glow font-semibold mt-2">
            Your Turn
          </div>
        </div>
      )}
      
      {/* Traditional decoration */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <svg width="40" height="8" viewBox="0 0 40 8">
          <path
            d="M2 4 Q10 0 20 4 Q30 8 38 4"
            stroke="hsl(var(--gold-primary))"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};