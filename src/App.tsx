import React, { useState } from 'react';
import { useEffect } from 'react';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import Tutorial from './components/Tutorial';
import { useGameState } from './hooks/useGameState';
import { makeMove, isValidMove, getAIMove } from './utils/gameLogic';

function App() {
  const { gameState, resetGame, updateGameState } = useGameState();
  const [showTutorial, setShowTutorial] = useState(false);

  // AI move effect
  useEffect(() => {
    if (gameState.mode === 'ai' && gameState.turn === 'player2' && !gameState.gameOver) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(gameState);
        if (aiMove !== -1) {
          const newGameState = makeMove(aiMove, gameState);
          updateGameState(newGameState);
        }
      }, 1000); // 1 second delay for AI move
      
      return () => clearTimeout(timer);
    }
  }, [gameState, updateGameState]);

  const handlePitClick = (pitIndex: number) => {
    // Prevent clicks during AI turn
    if (gameState.mode === 'ai' && gameState.turn === 'player2') return;
    
    if (!isValidMove(pitIndex, gameState)) return;
    
    const newGameState = makeMove(pitIndex, gameState);
    updateGameState(newGameState);
  };

  const handleStartGame = () => {
    resetGame();
  };

  const handleShowHelp = () => {
    setShowTutorial(true);
  };

  const handleToggleMode = () => {
    const newMode = gameState.mode === 'twoPlayer' ? 'ai' : 'twoPlayer';
    updateGameState({ mode: newMode });
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tamil-sandalwood via-tamil-turmeric to-tamil-saffron">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-tamil-red mb-2">
          Pallanguzhi
        </h1>
        <p className="text-xl text-tamil-brown">
          Traditional South Indian Board Game
        </p>
      </header>

      {/* Main Game Area */}
      <main className="container mx-auto px-4 pb-8">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Game Board */}
          <div className="flex-1 max-w-4xl">
            <GameBoard 
              gameState={gameState} 
              onPitClick={handlePitClick}
            />
          </div>

          {/* Game Controls */}
          <div className="w-full lg:w-80">
            <GameControls
              gameState={gameState}
              onStartGame={handleStartGame}
              onShowHelp={handleShowHelp}
              onToggleMode={handleToggleMode}
            />
          </div>
        </div>
      </main>

      {/* Tutorial Modal */}
      <Tutorial 
        isOpen={showTutorial}
        onClose={handleCloseTutorial}
      />

      {/* Footer */}
      <footer className="text-center py-6 text-tamil-brown">
        <p>Experience the ancient game of strategy and skill</p>
      </footer>
    </div>
  );
}

export default App;