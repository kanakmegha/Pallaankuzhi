import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RotateCcw, Crown, BookOpen, Monitor, Bot, Users } from 'lucide-react';
import { AnimatedDemo } from './AnimatedDemo';

interface GameControlsProps {
  onNewGame: (mode?: 'human-vs-human' | 'human-vs-computer') => void;
  onStartTutorial: () => void;
  gamePhase: 'playing' | 'roundEnd' | 'ended' | 'tutorial';
  currentPlayer: 1 | 2;
  gameMode: 'human-vs-human' | 'human-vs-computer';
  isAIThinking: boolean;
  aiStats?: {
    gamesPlayed: number;
    wins: number;
    winRate: string;
    difficulty: string;
    epsilon: string;
    qTableSize: number;
  };
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onStartTutorial,
  gamePhase,
  currentPlayer,
  gameMode,
  isAIThinking,
  aiStats,
}) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="flex flex-col gap-6 items-center justify-center mb-8">
      {/* Game Mode Selection */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button
          onClick={() => onNewGame('human-vs-human')}
          variant={gameMode === 'human-vs-human' ? 'default' : 'outline'}
          size="lg"
          className="bg-wood-primary hover:bg-wood-secondary text-wood-text border-2 border-gold-primary shadow-elegant"
        >
          <Users className="w-5 h-5 mr-2" />
          Human vs Human
        </Button>
        
        <Button
          onClick={() => onNewGame('human-vs-computer')}
          variant={gameMode === 'human-vs-computer' ? 'default' : 'outline'}
          size="lg"
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-2 border-primary shadow-elegant"
        >
          <Bot className="w-5 h-5 mr-2" />
          Play vs AI
        </Button>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button
          onClick={() => onNewGame()}
          variant="outline"
          size="lg"
          className="border-2 shadow-elegant"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          New Game
        </Button>
        
        <Button
          onClick={onStartTutorial}
          variant="secondary"
          size="lg"
          className="bg-gold-primary hover:bg-gold-secondary text-wood-text border-2 border-wood-primary shadow-elegant"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Interactive Tutorial
        </Button>
        
        <Dialog open={showDemo} onOpenChange={setShowDemo}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="bg-muted hover:bg-muted/80 text-foreground border-2 border-primary shadow-elegant"
            >
              <Monitor className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center text-primary">
                How to Play Pallanguzhi
              </DialogTitle>
            </DialogHeader>
            <AnimatedDemo />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Game Status */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-gold-primary rounded-lg">
          <Crown className={`w-5 h-5 ${gamePhase === 'tutorial' ? 'text-gold-primary' : currentPlayer === 1 ? 'text-shell-primary' : 'text-shell-secondary'}`} />
          <span className="font-semibold text-card-foreground">
            {gamePhase === 'tutorial' ? 'Tutorial Mode' : 
             gameMode === 'human-vs-computer' && currentPlayer === 2 ? 
             (isAIThinking ? 'AI Thinking...' : 'AI Turn') : 
             `Player ${currentPlayer}'s Turn`}
          </span>
        </div>
        
        {/* AI Stats */}
        {gameMode === 'human-vs-computer' && aiStats && (
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary rounded-lg">
            <Bot className="w-5 h-5 text-secondary" />
            <div className="text-sm text-card-foreground">
              <span className="font-semibold">AI Level: {aiStats.difficulty}</span>
              <span className="text-muted-foreground ml-2">
                ({aiStats.gamesPlayed} games, {aiStats.winRate}% win rate)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};