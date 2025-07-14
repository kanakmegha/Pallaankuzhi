import { useState, useEffect } from 'react';
import { GameState } from '../types/game';

const INITIAL_STATE: GameState = {
  board: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // 14 pits, no stores
  turn: 'player1',
  scores: { player1: 0, player2: 0 },
  round: 1,
  unusablePits: { player1: [], player2: [] },
  mode: 'twoPlayer',
  gameOver: false,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('pallanguzhi-game');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState(parsed);
      } catch (error) {
        console.error('Failed to load saved game:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pallanguzhi-game', JSON.stringify(gameState));
  }, [gameState]);

  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...newState }));
  };

  return {
    gameState,
    resetGame,
    updateGameState,
  };
};