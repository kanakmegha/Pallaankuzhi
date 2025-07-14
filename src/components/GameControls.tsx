import React from 'react';
import { RotateCcw, HelpCircle, Trophy, Users, Bot } from 'lucide-react';
import { GameState } from '../types/game';

interface GameControlsProps {
  gameState: GameState;
  onStartGame: () => void;
  onShowHelp: () => void;
  onToggleMode: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  gameState, 
  onStartGame, 
  onShowHelp, 
  onToggleMode 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-tamil-red p-6 min-w-[280px]">
      {/* Game Status */}
      <div className="text-center mb-6">
        {gameState.gameOver ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-tamil-red">
              <Trophy className="w-8 h-8" />
              <span>Game Over!</span>
            </div>
            <div className="text-lg text-tamil-brown">
              {gameState.winner === 'tie' 
                ? "It's a tie!" 
                : `${gameState.winner === 'player1' ? 'Player 1' : (gameState.mode === 'ai' ? 'AI' : 'Player 2')} wins!`}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xl font-semibold text-tamil-red">
              {gameState.mode === 'ai' && gameState.turn === 'player2' 
                ? "AI's Turn" 
                : `${gameState.turn === 'player1' ? 'Player 1' : 'Player 2'}'s Turn`}
            </div>
            <div className="text-sm text-tamil-brown">
              {gameState.mode === 'twoPlayer' ? 'Two Player Mode' : 'vs AI Mode'}
            </div>
          </div>
        )}
      </div>

      {/* Round Display */}
      <div className="text-center mb-6">
        <div className="bg-tamil-red text-white px-4 py-2 rounded-lg font-semibold">
          Round {gameState.round}
        </div>
      </div>

      {/* Scores */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center p-3 bg-tamil-saffron rounded-lg border border-tamil-red">
          <span className="font-medium text-tamil-brown">Player 1:</span>
          <span className="text-xl font-bold text-tamil-red">{gameState.scores.player1} shells</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-tamil-saffron rounded-lg border border-tamil-red">
          <span className="font-medium text-tamil-brown">
            {gameState.mode === 'ai' ? 'AI:' : 'Player 2:'}
          </span>
          <span className="text-xl font-bold text-tamil-red">{gameState.scores.player2} shells</span>
        </div>
      </div>

      {/* Unusable Pits Info */}
      {(gameState.unusablePits.player1.length > 0 || gameState.unusablePits.player2.length > 0) && (
        <div className="text-center text-sm text-tamil-brown bg-tamil-turmeric p-3 rounded border border-tamil-red mb-6">
          <div className="font-semibold mb-1">Unusable Pits:</div>
          {gameState.unusablePits.player1.length > 0 && (
            <div>Player 1: {gameState.unusablePits.player1.map(p => p + 1).join(', ')}</div>
          )}
          {gameState.unusablePits.player2.length > 0 && (
            <div>
              {gameState.mode === 'ai' ? 'AI' : 'Player 2'}: {gameState.unusablePits.player2.map(p => p - 6).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="space-y-3">
        <button
          onClick={onStartGame}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-tamil-red hover:bg-tamil-brown text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-tamil-gold focus:ring-offset-2 border border-tamil-brown"
          aria-label="Start new game"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Start Game</span>
        </button>
        
        <button
          onClick={onToggleMode}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-tamil-turmeric hover:bg-tamil-gold text-tamil-red font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-tamil-red focus:ring-offset-2 border border-tamil-red"
          aria-label="Toggle game mode"
        >
          {gameState.mode === 'twoPlayer' ? <Bot className="w-5 h-5" /> : <Users className="w-5 h-5" />}
          <span>Switch to {gameState.mode === 'twoPlayer' ? 'AI Mode' : '2 Player'}</span>
        </button>
        
        <button
          onClick={onShowHelp}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-tamil-turmeric hover:bg-tamil-gold text-tamil-red font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-tamil-red focus:ring-offset-2 border border-tamil-red"
          aria-label="Show help"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </button>
      </div>

      {/* Game Instructions */}
      {!gameState.gameOver && (
        <div className="text-center text-sm text-tamil-brown bg-tamil-sandalwood p-3 rounded border border-tamil-red mt-6">
          Click on a pit on your side to pick up shells and sow them counterclockwise.
          If any pit gets exactly 4 shells, that player captures them immediately!
        </div>
      )}
    </div>
  );
};

export default GameControls;