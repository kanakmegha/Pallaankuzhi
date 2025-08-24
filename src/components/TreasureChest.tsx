import React, { useState, useEffect } from 'react';
import { Shell } from './Shell';

interface TreasureChestProps {
  isOpen: boolean;
  onDistributionComplete: () => void;
  onStartDistribution: () => void;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({
  isOpen,
  onDistributionComplete,
  onStartDistribution,
}) => {
  const [shells, setShells] = useState<Array<{ id: number; x: number; y: number; isAnimating: boolean }>>([]);
  const [isDistributing, setIsDistributing] = useState(false);

  // Create initial shells inside the chest
  useEffect(() => {
    const initialShells = Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 60, // Inside chest area
      y: Math.random() * 40 + 20,
      isAnimating: false,
    }));
    setShells(initialShells);
  }, []);

  // Start distribution when chest opens
  useEffect(() => {
    if (isOpen && !isDistributing) {
      setIsDistributing(true);
      onStartDistribution();
      
      // Pit positions on the game board
      const pitPositions = [
        // Player 1 pits (bottom row)
        { x: 50, y: 350 }, { x: 150, y: 350 }, { x: 250, y: 350 }, { x: 350, y: 350 }, 
        { x: 450, y: 350 }, { x: 550, y: 350 }, { x: 650, y: 350 },
        // Player 2 pits (top row)
        { x: 650, y: 250 }, { x: 550, y: 250 }, { x: 450, y: 250 }, { x: 350, y: 250 }, 
        { x: 250, y: 250 }, { x: 150, y: 250 }, { x: 50, y: 250 },
      ];

      // Animate shells to pits (5 shells per pit)
      shells.forEach((shell, index) => {
        const pitIndex = Math.floor(index / 5);
        const targetPit = pitPositions[pitIndex];
        
        setTimeout(() => {
          setShells(prev => prev.map(s => 
            s.id === shell.id 
              ? { 
                  ...s, 
                  x: targetPit.x + Math.random() * 20 - 10, 
                  y: targetPit.y + Math.random() * 20 - 10, 
                  isAnimating: true 
                }
              : s
          ));
        }, index * 80);
      });

      // Complete distribution
      setTimeout(() => {
        onDistributionComplete();
      }, shells.length * 80 + 1000);
    }
  }, [isOpen, isDistributing, shells, onDistributionComplete, onStartDistribution]);

  return (
    <div className="absolute top-4 right-4 z-10">
      {/* Treasure Chest */}
      <div className={`relative transition-all duration-1000 ${isOpen ? 'scale-110' : 'scale-100'}`}>
        {/* Chest Base */}
        <div className="w-32 h-20 bg-gradient-to-br from-yellow-600 via-amber-700 to-yellow-800 rounded-lg border-4 border-yellow-500 shadow-2xl relative overflow-hidden">
          {/* Wood texture */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" viewBox="0 0 128 80">
              <defs>
                <pattern id="wood" patternUnits="userSpaceOnUse" width="8" height="8">
                  <rect width="8" height="8" fill="#a16207" />
                  <path d="M0 0L8 8M8 0L0 8" stroke="#92400e" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#wood)" />
            </svg>
          </div>
          
          {/* Metal bands */}
          <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 shadow-inner"></div>
          <div className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 shadow-inner"></div>
          
          {/* Lock */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-sm border border-yellow-700"></div>
        </div>

        {/* Chest Lid */}
        <div 
          className={`absolute -top-3 left-0 w-32 h-16 bg-gradient-to-br from-yellow-600 via-amber-700 to-yellow-800 rounded-t-lg border-4 border-yellow-500 shadow-2xl transition-transform duration-1000 origin-bottom ${
            isOpen ? 'rotate-[-45deg] translate-y-[-20px]' : 'rotate-0'
          }`}
        >
          {/* Lid wood texture */}
          <div className="absolute inset-0 opacity-30 rounded-t-lg overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 128 64">
              <rect width="100%" height="100%" fill="url(#wood)" />
            </svg>
          </div>
          
          {/* Lid metal band */}
          <div className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 shadow-inner"></div>
        </div>

        {/* Treasure Glow when open */}
        {isOpen && (
          <div className="absolute inset-0 bg-gradient-radial from-yellow-300/50 via-transparent to-transparent rounded-lg animate-pulse"></div>
        )}

        {/* Animated Shells */}
        <div className="absolute inset-0">
          {shells.map((shell) => (
            <Shell
              key={shell.id}
              position={{ x: shell.x, y: shell.y }}
              delay={0}
              isAnimating={shell.isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};