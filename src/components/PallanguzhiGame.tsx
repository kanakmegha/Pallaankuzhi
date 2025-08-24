import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameBoard } from './GameBoard';
import { PlayerPanel } from './PlayerPanel';
import { GameControls } from './GameControls';
import { useToast } from '@/hooks/use-toast';
import { AIPlayer } from './AIPlayer';
import { TreasureChest } from './TreasureChest';

export interface GameState {
  board: number[]; // 14 pits, 0-6 for player 1, 7-13 for player 2
  player1Seeds: number; // Seeds captured by player 1
  player2Seeds: number; // Seeds captured by player 2
  currentPlayer: 1 | 2;
  gamePhase: 'playing' | 'roundEnd' | 'ended' | 'tutorial';
  selectedPit: number | null;
  lastMove: {
    from: number;
    captures: number[];
    lastPit: number;
  } | null;
  round: number;
  tutorialStep: number;
  tutorialMessage: string;
  gameMode: 'human-vs-human' | 'human-vs-computer';
  isAIThinking: boolean;
  showBoard: boolean;
  isDistributing: boolean;
}

export const PallanguzhiGame: React.FC = () => {
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    board: Array(14).fill(5), // Traditional Pallankuzhi: 5 seeds per pit
    player1Seeds: 0, // Seeds captured by player 1
    player2Seeds: 0, // Seeds captured by player 2
    currentPlayer: 1,
    gamePhase: 'playing',
    selectedPit: null,
    lastMove: null,
    round: 1,
    tutorialStep: 0,
    tutorialMessage: '',
    gameMode: 'human-vs-human',
    isAIThinking: false,
    showBoard: false,
    isDistributing: false,
  });

  const [animatingMove, setAnimatingMove] = useState(false);
  const aiPlayerRef = useRef<AIPlayer>(new AIPlayer());

  const resetGame = useCallback((mode: 'human-vs-human' | 'human-vs-computer' = 'human-vs-human') => {
    setGameState({
      board: Array(14).fill(5),
      player1Seeds: 0,
      player2Seeds: 0,
      currentPlayer: 1,
      gamePhase: 'playing',
      selectedPit: null,
      lastMove: null,
      round: 1,
      tutorialStep: 0,
      tutorialMessage: '',
      gameMode: mode,
      isAIThinking: false,
      showBoard: false,
      isDistributing: true, // Start distribution immediately
    });
    toast({
      title: "New Game Started",
      description: mode === 'human-vs-computer' ? "Playing against AI!" : "Traditional Pallankuzhi - 5 seeds per pit!",
    });
  }, [toast]);

  const isValidMove = useCallback((pitIndex: number): boolean => {
    if (animatingMove || gameState.gamePhase === 'ended' || gameState.gamePhase === 'roundEnd') return false;
    
    // In tutorial mode, only allow specific moves
    if (gameState.gamePhase === 'tutorial') {
      return gameState.tutorialStep === 1 && pitIndex === 2;
    }
    
    // Check if pit belongs to current player and has seeds
    const isPlayer1Pit = pitIndex >= 0 && pitIndex <= 6;
    const isPlayer2Pit = pitIndex >= 7 && pitIndex <= 13;
    
    if (gameState.currentPlayer === 1 && !isPlayer1Pit) return false;
    if (gameState.currentPlayer === 2 && !isPlayer2Pit) return false;
    
    return gameState.board[pitIndex] > 0;
  }, [gameState, animatingMove]);

  const executeMove = useCallback(async (pitIndex: number) => {
    if (!isValidMove(pitIndex)) return;

    setAnimatingMove(true);
    
    const newBoard = [...gameState.board];
    let seedsToSow = newBoard[pitIndex];
    newBoard[pitIndex] = 0;
    
    let currentPit = pitIndex;
    let captures: number[] = [];
    let newPlayer1Seeds = gameState.player1Seeds;
    let newPlayer2Seeds = gameState.player2Seeds;

    // Traditional Pallankuzhi sowing logic
    while (seedsToSow > 0) {
      for (let i = 0; i < seedsToSow; i++) {
        // Move counterclockwise to next pit
        currentPit = (currentPit + 1) % 14;
        newBoard[currentPit]++;
        
        // Animation delay
        setGameState(prev => ({
          ...prev,
          board: [...newBoard],
          selectedPit: currentPit,
        }));
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Check for relay sowing - if last pit has seeds after sowing, continue
      if (newBoard[currentPit] > 1) { // More than just the seed we dropped
        seedsToSow = newBoard[currentPit];
        newBoard[currentPit] = 0;
        
        setGameState(prev => ({
          ...prev,
          board: [...newBoard],
          tutorialMessage: `Relay sowing! Taking ${seedsToSow} seeds from pit ${currentPit + 1} to continue...`,
        }));
        
        await new Promise(resolve => setTimeout(resolve, 800));
      } else {
        seedsToSow = 0; // End sowing
      }
    }

    // Check for capture - only if last seed landed in empty pit
    const lastPit = currentPit;
    const isLastPitEmpty = newBoard[lastPit] === 1; // Only the seed we just dropped
    
    if (isLastPitEmpty) {
      // Find next pit in sowing direction (counterclockwise)
      const nextPit = (lastPit + 1) % 14;
      
      if (newBoard[nextPit] > 0) {
        // Capture from next pit if it has seeds
        const capturedSeeds = newBoard[nextPit];
        newBoard[nextPit] = 0;
        captures.push(nextPit);
        
        // Award captured seeds to current player
        if (gameState.currentPlayer === 1) {
          newPlayer1Seeds += capturedSeeds;
        } else {
          newPlayer2Seeds += capturedSeeds;
        }
        
        setGameState(prev => ({
          ...prev,
          board: [...newBoard],
          player1Seeds: newPlayer1Seeds,
          player2Seeds: newPlayer2Seeds,
          tutorialMessage: `Capture! ${capturedSeeds} seeds captured from next pit!`,
        }));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // If next pit is empty, capture from opposite pit of the next pit
        const oppositePit = nextPit <= 6 ? nextPit + 7 : nextPit - 7;
        
        if (newBoard[oppositePit] > 0) {
          const capturedSeeds = newBoard[oppositePit];
          newBoard[oppositePit] = 0;
          captures.push(oppositePit);
          
          // Award captured seeds to current player
          if (gameState.currentPlayer === 1) {
            newPlayer1Seeds += capturedSeeds;
          } else {
            newPlayer2Seeds += capturedSeeds;
          }
          
          setGameState(prev => ({
            ...prev,
            board: [...newBoard],
            player1Seeds: newPlayer1Seeds,
            player2Seeds: newPlayer2Seeds,
            tutorialMessage: `Capture! ${capturedSeeds} seeds captured from opposite pit since next pit was empty!`,
          }));
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Check for round end - if a player's side is empty
    const player1Side = newBoard.slice(0, 7);
    const player2Side = newBoard.slice(7, 14);
    const player1Empty = player1Side.every(seeds => seeds === 0);
    const player2Empty = player2Side.every(seeds => seeds === 0);

    let gamePhase: 'playing' | 'roundEnd' | 'ended' = 'playing';
    let nextPlayer: 1 | 2 = gameState.currentPlayer === 1 ? 2 : 1;

    if (player1Empty || player2Empty) {
      // Collect remaining seeds for the player who still has seeds
      if (player1Empty && !player2Empty) {
        const remainingSeeds = player2Side.reduce((sum, seeds) => sum + seeds, 0);
        newPlayer2Seeds += remainingSeeds;
        newBoard.fill(0, 7, 14); // Clear player 2's side
      } else if (player2Empty && !player1Empty) {
        const remainingSeeds = player1Side.reduce((sum, seeds) => sum + seeds, 0);
        newPlayer1Seeds += remainingSeeds;
        newBoard.fill(0, 0, 7); // Clear player 1's side
      }
      
      gamePhase = 'roundEnd';
      
      // Check if both players can continue (need at least 6 seeds each)
      if (newPlayer1Seeds < 6 || newPlayer2Seeds < 6) {
        gamePhase = 'ended';
        const winner = newPlayer1Seeds > newPlayer2Seeds ? 1 : 
                      newPlayer2Seeds > newPlayer1Seeds ? 2 : null;
        
        toast({
          title: winner ? `Player ${winner} Wins!` : "It's a Tie!",
          description: `Final Score - Player 1: ${newPlayer1Seeds}, Player 2: ${newPlayer2Seeds}`,
        });
      } else {
        // Redistribute seeds for next round
        setTimeout(() => {
          redistributeSeeds(newPlayer1Seeds, newPlayer2Seeds);
        }, 2000);
      }
    }

    setGameState({
      board: newBoard,
      player1Seeds: newPlayer1Seeds,
      player2Seeds: newPlayer2Seeds,
      currentPlayer: gamePhase === 'ended' ? gameState.currentPlayer : nextPlayer,
      gamePhase,
      selectedPit: null,
      lastMove: {
        from: pitIndex,
        captures,
        lastPit,
      },
      round: gameState.round,
      tutorialStep: gameState.tutorialStep,
      tutorialMessage: gameState.tutorialMessage,
      gameMode: gameState.gameMode,
      isAIThinking: false,
      showBoard: gameState.showBoard,
      isDistributing: gameState.isDistributing,
    });

    setAnimatingMove(false);
  }, [gameState, isValidMove, toast]);

  const redistributeSeeds = useCallback((player1Seeds: number, player2Seeds: number) => {
    const newBoard = Array(14).fill(0);
    
    // Redistribute player 1's seeds (6 per pit)
    let remainingP1 = player1Seeds;
    for (let i = 0; i < 7 && remainingP1 >= 6; i++) {
      newBoard[i] = 6;
      remainingP1 -= 6;
    }
    
    // Redistribute player 2's seeds (6 per pit)
    let remainingP2 = player2Seeds;
    for (let i = 7; i < 14 && remainingP2 >= 6; i++) {
      newBoard[i] = 6;
      remainingP2 -= 6;
    }
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      player1Seeds: remainingP1,
      player2Seeds: remainingP2,
      gamePhase: 'playing',
      currentPlayer: 1,
      round: prev.round + 1,
      selectedPit: null,
      lastMove: null,
    }));
    
    toast({
      title: `Round ${gameState.round + 1} Started!`,
      description: "Seeds redistributed - 6 per pit",
    });
  }, [gameState.round, toast]);

  const startTutorial = useCallback(() => {
    setGameState({
      board: [5, 5, 1, 5, 0, 5, 5, 5, 5, 5, 3, 5, 5, 5],
      player1Seeds: 0,
      player2Seeds: 0,
      currentPlayer: 1,
      gamePhase: 'tutorial',
      selectedPit: null,
      lastMove: null,
      round: 1,
      tutorialStep: 1,
      tutorialMessage: "Welcome to Pallankuzhi! Each pit starts with 5 seeds. Click on pit 3 (third from left, bottom row) to learn the new capture rules.",
      gameMode: 'human-vs-human',
      isAIThinking: false,
      showBoard: true,
      isDistributing: false,
    });
    toast({
      title: "Tutorial Started",
      description: "Learn traditional Pallankuzhi rules!",
    });
  }, [toast]);

  const handleTutorialClick = useCallback(async (pitIndex: number) => {
    if (gameState.tutorialStep === 1 && pitIndex === 2) {
      // Simple tutorial move demonstration
      setAnimatingMove(true);
      
      const newBoard = [...gameState.board];
      const seedsToSow = newBoard[pitIndex];
      newBoard[pitIndex] = 0;
      
      let currentPit = pitIndex;
      
      setGameState(prev => ({
        ...prev,
        tutorialMessage: `Taking ${seedsToSow} seed from pit 3. Sowing counterclockwise...`,
        selectedPit: pitIndex,
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sow the single seed
      currentPit = (currentPit + 1) % 14;
      newBoard[currentPit]++;
      
      setGameState(prev => ({
        ...prev,
        board: [...newBoard],
        selectedPit: currentPit,
        tutorialMessage: `Seed dropped in pit ${currentPit + 1}. Last seed landed in empty pit - now capture from next pit!`,
      }));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demonstrate new capture rule: capture from next pit
      const nextPit = (currentPit + 1) % 14;
      if (newBoard[nextPit] > 0) {
        const capturedSeeds = newBoard[nextPit];
        newBoard[nextPit] = 0;
        
        setGameState(prev => ({
          ...prev,
          board: [...newBoard],
          player1Seeds: capturedSeeds,
          tutorialMessage: `🎯 Captured ${capturedSeeds} seeds from the next pit! New rule: if last seed lands in empty pit, capture from the next pit in sowing direction.`,
          gamePhase: 'ended',
          tutorialStep: 2,
        }));
      } else {
        // If next pit is empty, capture from opposite
        const oppositePit = nextPit <= 6 ? nextPit + 7 : nextPit - 7;
        const capturedSeeds = newBoard[oppositePit];
        newBoard[oppositePit] = 0;
        
        setGameState(prev => ({
          ...prev,
          board: [...newBoard],
          player1Seeds: capturedSeeds,
          tutorialMessage: `🎯 Next pit was empty, so captured ${capturedSeeds} seeds from opposite pit! Advanced rule: if next pit is also empty, capture from enemy's opposite pit.`,
          gamePhase: 'ended',
          tutorialStep: 2,
        }));
      }
      
      setAnimatingMove(false);
    }
  }, [gameState.tutorialStep]);

  // AI move execution
  useEffect(() => {
    if (gameState.gameMode === 'human-vs-computer' && 
        gameState.currentPlayer === 2 && 
        gameState.gamePhase === 'playing' && 
        !animatingMove && 
        !gameState.isAIThinking) {
      
      setGameState(prev => ({ ...prev, isAIThinking: true }));
      
      const makeAIMove = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Thinking delay
        
        const aiMove = aiPlayerRef.current.chooseMove(gameState);
        if (aiMove >= 0) {
          aiPlayerRef.current.prepareMove(gameState, aiMove);
          await executeMove(aiMove);
          
          // Update AI learning based on position
          const reward = aiPlayerRef.current.evaluatePosition(gameState);
          aiPlayerRef.current.updateQValue(gameState, reward);
        }
      };
      
      makeAIMove();
    }
  }, [gameState.gameMode, gameState.currentPlayer, gameState.gamePhase, animatingMove, gameState.isAIThinking, executeMove]);

  // Handle game end for AI learning
  useEffect(() => {
    if (gameState.gameMode === 'human-vs-computer' && gameState.gamePhase === 'ended') {
      const aiWon = gameState.player2Seeds > gameState.player1Seeds;
      aiPlayerRef.current.gameEnded(gameState, aiWon);
    }
  }, [gameState.gameMode, gameState.gamePhase, gameState.player1Seeds, gameState.player2Seeds]);

  const handlePitClick = useCallback((pitIndex: number) => {
    if (gameState.gamePhase === 'tutorial') {
      handleTutorialClick(pitIndex);
      return;
    }
    
    // Don't allow human moves during AI turn
    if (gameState.gameMode === 'human-vs-computer' && gameState.currentPlayer === 2) {
      return;
    }
    
    if (gameState.selectedPit === pitIndex) {
      executeMove(pitIndex);
    } else if (isValidMove(pitIndex)) {
      setGameState(prev => ({ ...prev, selectedPit: pitIndex }));
    }
  }, [gameState.selectedPit, gameState.gamePhase, gameState.gameMode, gameState.currentPlayer, isValidMove, executeMove, handleTutorialClick]);

  const handlePitDoubleClick = useCallback((pitIndex: number) => {
    executeMove(pitIndex);
  }, [executeMove]);

  const handleStartDistribution = useCallback(() => {
    setGameState(prev => ({ ...prev, isDistributing: true }));
  }, []);

  const handleDistributionComplete = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      showBoard: true, 
      isDistributing: false 
    }));
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            பல்லாங்குழி
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-2">
            Pallanguzhi
          </h2>
          <p className="text-lg text-muted-foreground">
            Traditional South Indian Board Game - Round {gameState.round}
          </p>
        </div>

        {/* Game Controls */}
        <GameControls 
          onNewGame={resetGame}
          onStartTutorial={startTutorial}
          gamePhase={gameState.gamePhase}
          currentPlayer={gameState.currentPlayer}
          gameMode={gameState.gameMode}
          isAIThinking={gameState.isAIThinking}
          aiStats={aiPlayerRef.current?.getStats()}
        />

        {/* Treasure Chest */}
        {!gameState.showBoard && (
          <TreasureChest
            isOpen={gameState.isDistributing}
            onStartDistribution={handleStartDistribution}
            onDistributionComplete={handleDistributionComplete}
          />
        )}

        {/* Game Area */}
        {gameState.showBoard && (
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Player 2 Panel */}
          <PlayerPanel
            player={2}
            score={gameState.player2Seeds}
            isActive={gameState.currentPlayer === 2}
            className="order-1 lg:order-1"
          />

          {/* Game Board */}
          <div className="order-2">
            <GameBoard
              board={gameState.board}
              onPitClick={handlePitClick}
              onPitDoubleClick={handlePitDoubleClick}
              selectedPit={gameState.selectedPit}
              validMoves={gameState.board.map((_, index) => isValidMove(index))}
              lastMove={gameState.lastMove}
              animatingMove={animatingMove}
              currentPlayer={gameState.currentPlayer}
            />
          </div>

          {/* Player 1 Panel */}
          <PlayerPanel
            player={1}
            score={gameState.player1Seeds}
            isActive={gameState.currentPlayer === 1}
            className="order-3 lg:order-3"
          />
          </div>
        )}

        {/* Game Status */}
        <div className="text-center mt-8">
          {gameState.gamePhase === 'tutorial' && (
            <div className="p-6 bg-gradient-to-r from-gold-primary/10 to-gold-secondary/10 border-2 border-gold-primary rounded-2xl mb-4 shadow-elegant">
              <h3 className="text-2xl font-bold text-gold-primary mb-3 flex items-center gap-2">
                📚 Interactive Tutorial
              </h3>
              <p className="text-lg text-card-foreground leading-relaxed">
                {gameState.tutorialMessage}
              </p>
            </div>
          )}
          {gameState.gamePhase === 'playing' && (
            <div className="p-4 bg-card border rounded-xl">
              <p className="text-xl text-muted-foreground mb-2">
                Player {gameState.currentPlayer}'s Turn - Round {gameState.round}
                {gameState.selectedPit !== null && ' - Click again to move'}
              </p>
              <p className="text-sm text-muted-foreground">
                Traditional Rules: Sow counterclockwise, relay if pit has seeds, capture from opposite when landing in empty pit on your side
              </p>
            </div>
          )}
          {gameState.gamePhase === 'roundEnd' && (
            <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">Round {gameState.round} Complete!</h3>
              <p className="text-lg mb-2">
                Player 1: {gameState.player1Seeds} seeds | Player 2: {gameState.player2Seeds} seeds
              </p>
              <p className="text-sm text-muted-foreground">
                Redistributing seeds for next round (6 per pit)...
              </p>
            </div>
          )}
          {gameState.gamePhase === 'ended' && (
            <div className="p-6 bg-card border border-gold-primary rounded-2xl">
              <h3 className="text-2xl font-bold text-gold-primary mb-2">Game Complete!</h3>
              <p className="text-lg">
                Final Score - Player 1: {gameState.player1Seeds} seeds | Player 2: {gameState.player2Seeds} seeds
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {gameState.player1Seeds === gameState.player2Seeds ? 
                  "Perfect tie!" : 
                  `${gameState.player1Seeds > gameState.player2Seeds ? 'Player 1' : 'Player 2'} wins!`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};