import { GameState } from '../types/game';

export const isValidMove = (pitIndex: number, gameState: GameState): boolean => {
  const { board, turn, gameOver, unusablePits } = gameState;
  
  if (gameOver) return false;
  if (board[pitIndex] === 0) return false;
  
  // Player 1 can only pick from pits 0-6, Player 2 from pits 7-13
  if (turn === 'player1') {
    if (pitIndex < 0 || pitIndex > 6) return false;
    if (unusablePits.player1.includes(pitIndex)) return false;
  }
  if (turn === 'player2') {
    if (pitIndex < 7 || pitIndex > 13) return false;
    if (unusablePits.player2.includes(pitIndex)) return false;
  }
  
  return true;
};

export const makeMove = (pitIndex: number, gameState: GameState): GameState => {
  if (!isValidMove(pitIndex, gameState)) return gameState;

  const newBoard = [...gameState.board];
  const newScores = { ...gameState.scores };
  const newUnusablePits = { 
    player1: [...gameState.unusablePits.player1],
    player2: [...gameState.unusablePits.player2]
  };
  
  let currentPit = pitIndex;
  let shells = newBoard[pitIndex];
  
  // Empty the selected pit
  newBoard[pitIndex] = 0;
  
  // Sow shells counterclockwise
  while (shells > 0) {
    currentPit = getNextPit(currentPit);
    newBoard[currentPit]++;
    shells--;
    
    // Check for 4-shell rule during sowing
    if (newBoard[currentPit] === 4) {
      const pitOwner = currentPit <= 6 ? 'player1' : 'player2';
      newScores[pitOwner] += 4;
      newBoard[currentPit] = 0;
    }
  }
  
  const lastPit = currentPit;
  
  // Continue sowing logic: check the next pit after the last shell
  let continueTurn = true;
  while (continueTurn) {
    const nextPit = getNextPit(lastPit);
    
    if (newBoard[nextPit] > 0) {
      // Next pit has shells, pick them up and continue sowing
      shells = newBoard[nextPit];
      newBoard[nextPit] = 0;
      currentPit = nextPit;
      
      while (shells > 0) {
        currentPit = getNextPit(currentPit);
        newBoard[currentPit]++;
        shells--;
        
        // Check for 4-shell rule during continued sowing
        if (newBoard[currentPit] === 4) {
          const pitOwner = currentPit <= 6 ? 'player1' : 'player2';
          newScores[pitOwner] += 4;
          newBoard[currentPit] = 0;
        }
      }
      
      // Update last pit for next iteration
      const newLastPit = currentPit;
      if (newLastPit === lastPit) {
        // Prevent infinite loop
        continueTurn = false;
      } else {
        currentPit = newLastPit;
      }
    } else {
      // Next pit is empty, capture shells and end turn
      const capturedShells = newBoard[nextPit]; // This will be 0, but following the rule
      if (gameState.turn === 'player1') {
        newScores.player1 += capturedShells;
      } else {
        newScores.player2 += capturedShells;
      }
      continueTurn = false;
    }
  }
  
  // Check if player's side is empty (round end)
  const player1Side = newBoard.slice(0, 7);
  const player2Side = newBoard.slice(7, 14);
  const player1Empty = player1Side.every(pit => pit === 0);
  const player2Empty = player2Side.every(pit => pit === 0);
  
  let newRound = gameState.round;
  let gameOver = false;
  let winner: 'player1' | 'player2' | 'tie' | undefined;
  
  if (player1Empty || player2Empty) {
    newRound++;
    
    // Refill pits with 5 shells each from score pile
    if (player1Empty && newScores.player1 >= 5) {
      const pitsToFill = Math.floor(newScores.player1 / 5);
      const shellsUsed = Math.min(pitsToFill * 5, newScores.player1);
      newScores.player1 -= shellsUsed;
      
      // Fill pits from left to right (0-6)
      for (let i = 0; i < Math.min(pitsToFill, 7); i++) {
        newBoard[i] = 5;
      }
      
      // Mark unfilled pits as unusable
      for (let i = pitsToFill; i < 7; i++) {
        if (!newUnusablePits.player1.includes(i)) {
          newUnusablePits.player1.push(i);
        }
      }
      
      // Check if only one pit can be filled (game end condition)
      if (pitsToFill <= 1) {
        gameOver = true;
      }
    } else if (player1Empty) {
      gameOver = true;
    }
    
    if (player2Empty && newScores.player2 >= 5) {
      const pitsToFill = Math.floor(newScores.player2 / 5);
      const shellsUsed = Math.min(pitsToFill * 5, newScores.player2);
      newScores.player2 -= shellsUsed;
      
      // Fill pits from left to right (7-13)
      for (let i = 7; i < Math.min(7 + pitsToFill, 14); i++) {
        newBoard[i] = 5;
      }
      
      // Mark unfilled pits as unusable
      for (let i = 7 + pitsToFill; i < 14; i++) {
        if (!newUnusablePits.player2.includes(i)) {
          newUnusablePits.player2.push(i);
        }
      }
      
      // Check if only one pit can be filled (game end condition)
      if (pitsToFill <= 1) {
        gameOver = true;
      }
    } else if (player2Empty) {
      gameOver = true;
    }
  }
  
  // Determine winner if game is over
  if (gameOver) {
    if (newScores.player1 > newScores.player2) winner = 'player1';
    else if (newScores.player2 > newScores.player1) winner = 'player2';
    else winner = 'tie';
  }
  
  return {
    board: newBoard,
    turn: gameState.turn === 'player1' ? 'player2' : 'player1',
    scores: newScores,
    round: newRound,
    unusablePits: newUnusablePits,
    mode: gameState.mode,
    gameOver,
    winner,
  };
};

export const getAIMove = (gameState: GameState): number => {
  const { board, unusablePits } = gameState;
  const validMoves: number[] = [];
  
  // Find all valid moves for Player 2 (AI)
  for (let i = 7; i <= 13; i++) {
    if (board[i] > 0 && !unusablePits.player2.includes(i)) {
      validMoves.push(i);
    }
  }
  
  if (validMoves.length === 0) return -1;
  
  // Simple AI: randomly select a valid move
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};

const getNextPit = (currentPit: number): number => {
  return (currentPit + 1) % 14;
};