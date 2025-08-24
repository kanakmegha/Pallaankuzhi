import React from 'react';
import { Pit } from './Pit';

interface GameBoardProps {
  board: number[];
  onPitClick: (pitIndex: number) => void;
  onPitDoubleClick: (pitIndex: number) => void;
  selectedPit: number | null;
  validMoves: boolean[];
  lastMove: { from: number; captures: number[] } | null;
  animatingMove: boolean;
  currentPlayer: 1 | 2;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onPitClick,
  onPitDoubleClick,
  selectedPit,
  validMoves,
  lastMove,
  animatingMove,
  currentPlayer,
}) => {
  return (
    <div className="game-board">
      {/* Traditional decorative border */}
      <div className="absolute -inset-4 bg-gradient-to-r from-gold-secondary via-gold-primary to-gold-secondary rounded-[2.5rem] opacity-20"></div>
      
      <div className="relative">
        {/* Player 2 Row (Top) - Pits 13 to 7 (right to left) */}
        <div className="flex gap-4 mb-8 justify-center">
          {Array.from({ length: 7 }, (_, i) => {
            const pitIndex = 13 - i; // 13, 12, 11, 10, 9, 8, 7
            return (
              <Pit
                key={pitIndex}
                pitIndex={pitIndex}
                shellCount={board[pitIndex]}
                isSelected={selectedPit === pitIndex}
                isValidMove={validMoves[pitIndex]}
                wasLastMove={lastMove?.from === pitIndex}
                wasCaptured={lastMove?.captures.includes(pitIndex) || false}
                onClick={() => onPitClick(pitIndex)}
                onDoubleClick={() => onPitDoubleClick(pitIndex)}
                disabled={animatingMove}
                belongsToPlayer={2}
                isActivePlayer={currentPlayer === 2}
              />
            );
          })}
        </div>

        {/* Center decoration */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-2 bg-gradient-to-r from-transparent via-gold-primary to-transparent rounded-full opacity-50"></div>
        </div>

        {/* Player 1 Row (Bottom) - Pits 0 to 6 (left to right) */}
        <div className="flex gap-4 justify-center">
          {Array.from({ length: 7 }, (_, i) => (
            <Pit
              key={i}
              pitIndex={i}
              shellCount={board[i]}
              isSelected={selectedPit === i}
              isValidMove={validMoves[i]}
              wasLastMove={lastMove?.from === i}
              wasCaptured={lastMove?.captures.includes(i) || false}
              onClick={() => onPitClick(i)}
              onDoubleClick={() => onPitDoubleClick(i)}
              disabled={animatingMove}
              belongsToPlayer={1}
              isActivePlayer={currentPlayer === 1}
            />
          ))}
        </div>

        {/* Traditional pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 400 200">
            <defs>
              <pattern id="traditional-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" />
                <circle cx="10" cy="10" r="1" fill="currentColor" />
                <circle cx="30" cy="30" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#traditional-pattern)" />
          </svg>
        </div>
      </div>
    </div>
  );
};