import React, { useRef, useEffect, useState } from 'react';
import { GameState } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  onPitClick: (pitIndex: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onPitClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPit, setHoveredPit] = useState<number | null>(null);
  const [animatingHand, setAnimatingHand] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  const BOARD_WIDTH = 700;
  const BOARD_HEIGHT = 250;
  const PIT_RADIUS = 35;
  const SHELL_RADIUS = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      
      // Draw background with subtle gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, BOARD_HEIGHT);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.5, '#F4E3D3');
      gradient.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      
      // Draw subtle rangoli pattern
      drawRangoliPattern(ctx);
      
      // Draw divider line with rangoli style
      drawRangoliDivider(ctx);
      
      // Draw pits and shells
      drawPitsAndShells(ctx);
      
      // Draw animated hand if visible
      if (animatingHand.visible) {
        drawAnimatedHand(ctx);
      }
    };

    const drawRangoliPattern = (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = '#E9C46A';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.1;
      
      // Simple geometric pattern inspired by rangoli
      const centerX = BOARD_WIDTH / 2;
      const centerY = BOARD_HEIGHT / 2;
      
      // Draw concentric circles
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, i * 15, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw radiating lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = centerX + Math.cos(angle) * 15;
        const y1 = centerY + Math.sin(angle) * 15;
        const x2 = centerX + Math.cos(angle) * 45;
        const y2 = centerY + Math.sin(angle) * 45;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
    };

    const drawRangoliDivider = (ctx: CanvasRenderingContext2D) => {
      const centerY = BOARD_HEIGHT / 2;
      const startX = 50;
      const endX = BOARD_WIDTH - 50;
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      
      // Draw main line
      ctx.beginPath();
      ctx.moveTo(startX, centerY);
      ctx.lineTo(endX, centerY);
      ctx.stroke();
      
      // Draw decorative dots along the line
      ctx.fillStyle = '#FFFFFF';
      for (let x = startX + 20; x < endX; x += 30) {
        ctx.beginPath();
        ctx.arc(x, centerY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
    };

    const drawPitsAndShells = (ctx: CanvasRenderingContext2D) => {
      const pitPositions = getPitPositions();
      
      pitPositions.forEach((pos, index) => {
        const isUnusable = (gameState.turn === 'player1' && gameState.unusablePits.player1.includes(index)) ||
                          (gameState.turn === 'player2' && gameState.unusablePits.player2.includes(index));
        
        // Draw pit shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(pos.x + 2, pos.y + 2, PIT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pit
        if (isUnusable) {
          ctx.fillStyle = '#8B4513'; // darker brown for unusable pits
        } else if (hoveredPit === index) {
          ctx.fillStyle = '#DAA520'; // gold for hover
        } else {
          ctx.fillStyle = '#E9C46A'; // turmeric
        }
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, PIT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pit border
        ctx.strokeStyle = '#9B2226';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw inner circle for depth
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, PIT_RADIUS - 6, 0, Math.PI * 2);
        ctx.stroke();
        
        if (!isUnusable) {
          // Draw shells
          const shellCount = gameState.board[index];
          drawShells(ctx, pos.x, pos.y, shellCount, PIT_RADIUS - 8);
          
          // Draw shell count
          ctx.fillStyle = '#9B2226';
          ctx.font = 'bold 14px "Noto Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(shellCount.toString(), pos.x, pos.y + 4);
        } else {
          // Draw X for unusable pit
          ctx.strokeStyle = '#9B2226';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pos.x - 10, pos.y - 10);
          ctx.lineTo(pos.x + 10, pos.y + 10);
          ctx.moveTo(pos.x + 10, pos.y - 10);
          ctx.lineTo(pos.x - 10, pos.y + 10);
          ctx.stroke();
        }
      });
    };

    const drawShells = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, count: number, maxRadius: number) => {
      if (count === 0) return;
      
      const shellsPerRing = Math.min(6, count);
      const rings = Math.ceil(count / shellsPerRing);
      let shellIndex = 0;
      
      for (let ring = 0; ring < rings && shellIndex < count; ring++) {
        const ringRadius = (maxRadius / rings) * (ring + 1);
        const shellsInThisRing = Math.min(shellsPerRing, count - shellIndex);
        
        for (let i = 0; i < shellsInThisRing; i++) {
          const angle = (i / shellsInThisRing) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * ringRadius;
          const y = centerY + Math.sin(angle) * ringRadius;
          
          // Draw cowrie shell shape
          ctx.fillStyle = '#F4A261';
          ctx.beginPath();
          ctx.ellipse(x, y, SHELL_RADIUS, SHELL_RADIUS * 0.7, angle, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = '#9B2226';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Add small line for cowrie shell detail
          ctx.strokeStyle = '#8B4513';
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(x - SHELL_RADIUS * 0.5, y);
          ctx.lineTo(x + SHELL_RADIUS * 0.5, y);
          ctx.stroke();
          
          shellIndex++;
        }
      }
    };

    const drawAnimatedHand = (ctx: CanvasRenderingContext2D) => {
      const { x, y } = animatingHand;
      
      // Draw simple hand pointer
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw finger pointing
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 12, y - 12);
      ctx.stroke();
      
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(x + 12, y - 12, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();
  }, [gameState, hoveredPit, animatingHand]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const pitPositions = getPitPositions();
    
    for (let i = 0; i < pitPositions.length; i++) {
      const pos = pitPositions[i];
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      
      if (distance <= PIT_RADIUS) {
        // Animate hand to clicked position
        setAnimatingHand({ x: pos.x, y: pos.y, visible: true });
        setTimeout(() => {
          setAnimatingHand(prev => ({ ...prev, visible: false }));
        }, 500);
        
        onPitClick(i);
        break;
      }
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const pitPositions = getPitPositions();
    let newHoveredPit = null;
    
    for (let i = 0; i < pitPositions.length; i++) {
      const pos = pitPositions[i];
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      
      if (distance <= PIT_RADIUS) {
        // Only highlight if it's a valid move
        if ((gameState.turn === 'player1' && i >= 0 && i <= 6) ||
            (gameState.turn === 'player2' && i >= 7 && i <= 13)) {
          if (gameState.board[i] > 0 && !gameState.gameOver) {
            const isUnusable = (gameState.turn === 'player1' && gameState.unusablePits.player1.includes(i)) ||
                              (gameState.turn === 'player2' && gameState.unusablePits.player2.includes(i));
            if (!isUnusable) {
              newHoveredPit = i;
            }
          }
        }
        break;
      }
    }
    
    setHoveredPit(newHoveredPit);
  };

  const getPitPositions = () => {
    const positions = [];
    const startX = 80;
    const spacing = (BOARD_WIDTH - 160) / 6;
    
    // Player 1 pits (bottom row, indices 0-6)
    for (let i = 0; i < 7; i++) {
      positions[i] = {
        x: startX + i * spacing,
        y: (BOARD_HEIGHT * 3) / 4
      };
    }
    
    // Player 2 pits (top row, indices 7-13)
    for (let i = 0; i < 7; i++) {
      positions[7 + i] = {
        x: startX + (6 - i) * spacing, // Reverse order for counterclockwise
        y: BOARD_HEIGHT / 4
      };
    }
    
    return positions;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Player Labels */}
      <div className="w-full max-w-2xl">
        <div className="text-center mb-2">
          <span className="text-lg font-semibold text-tamil-red">
            {gameState.mode === 'ai' && gameState.turn === 'player2' ? 'AI Player' : 'Player 2'}
          </span>
        </div>
        
        <div className="flex justify-center items-center p-4">
          <canvas
            ref={canvasRef}
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoveredPit(null)}
            className="border-2 border-tamil-red rounded-lg shadow-lg cursor-pointer bg-white"
            role="button"
            tabIndex={0}
            aria-label="Pallanguzhi game board"
          />
        </div>
        
        <div className="text-center mt-2">
          <span className="text-lg font-semibold text-tamil-red">Player 1</span>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;