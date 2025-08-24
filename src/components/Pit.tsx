import React from 'react';
import { Shell } from './Shell';

interface PitProps {
  pitIndex: number;
  shellCount: number;
  isSelected: boolean;
  isValidMove: boolean;
  wasLastMove: boolean;
  wasCaptured: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  disabled: boolean;
  belongsToPlayer: 1 | 2;
  isActivePlayer: boolean;
}

export const Pit: React.FC<PitProps> = ({
  pitIndex,
  shellCount,
  isSelected,
  isValidMove,
  wasLastMove,
  wasCaptured,
  onClick,
  onDoubleClick,
  disabled,
  belongsToPlayer,
  isActivePlayer,
}) => {
  const getShellPositions = (count: number) => {
    const positions = [];
    const centerX = 32; // Half of pit width (w-16 = 64px / 2)
    const centerY = 32; // Half of pit height
    const radius = 20; // Radius for shell placement

    if (count === 0) return positions;

    if (count === 1) {
      positions.push({ x: centerX - 6, y: centerY - 6 }); // Center one shell
    } else if (count <= 8) {
      // Arrange in circle
      for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count;
        const x = centerX + Math.cos(angle) * radius - 6;
        const y = centerY + Math.sin(angle) * radius - 6;
        positions.push({ x, y });
      }
    } else {
      // For more than 8, create inner and outer circles
      const innerCount = Math.min(count, 6);
      const outerCount = count - innerCount;
      
      // Inner circle
      for (let i = 0; i < innerCount; i++) {
        const angle = (2 * Math.PI * i) / innerCount;
        const x = centerX + Math.cos(angle) * 12 - 6;
        const y = centerY + Math.sin(angle) * 12 - 6;
        positions.push({ x, y });
      }
      
      // Outer circle
      for (let i = 0; i < outerCount; i++) {
        const angle = (2 * Math.PI * i) / outerCount;
        const x = centerX + Math.cos(angle) * radius - 6;
        const y = centerY + Math.sin(angle) * radius - 6;
        positions.push({ x, y });
      }
    }

    return positions;
  };

  const shellPositions = getShellPositions(shellCount);

  return (
    <div
      className={`
        pit relative
        ${isSelected ? 'active' : ''}
        ${isValidMove && isActivePlayer ? 'valid-move' : ''}
        ${wasLastMove ? 'ring-2 ring-gold-primary ring-opacity-70' : ''}
        ${wasCaptured ? 'animate-pulse' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${!isValidMove || !isActivePlayer ? 'cursor-not-allowed opacity-75' : ''}
      `}
      onClick={!disabled ? onClick : undefined}
      onDoubleClick={!disabled ? onDoubleClick : undefined}
      style={{
        animation: wasCaptured ? 'capture-glow 1s ease-out' : undefined,
      }}
    >
      {/* Pit number label for debugging */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground font-mono">
        {pitIndex}
      </div>
      
      {/* Shell count indicator */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-foreground">
        {shellCount}
      </div>

      {/* Shells */}
      {shellPositions.map((position, index) => (
        <Shell
          key={`${pitIndex}-${index}`}
          position={position}
          delay={index * 0.1}
          isAnimating={wasLastMove}
        />
      ))}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-full border-4 border-active-glow animate-pulse"></div>
      )}

      {/* Valid move indicator */}
      {isValidMove && isActivePlayer && !isSelected && (
        <div className="absolute inset-0 rounded-full border-2 border-valid-move border-opacity-60 animate-pulse"></div>
      )}
    </div>
  );
};