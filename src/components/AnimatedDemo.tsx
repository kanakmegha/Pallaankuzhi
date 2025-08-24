import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, FastForward, Trophy } from 'lucide-react';
import { ComplimentPopup } from './ComplimentPopup';
import { useGameSounds } from '@/hooks/useGameSounds';
import { Shell } from './Shell';
import { demoSteps } from '@/utils/demoStepsData';

interface DemoState {
  board: number[];
  player1Seeds: number;
  player2Seeds: number;
  currentPlayer: 1 | 2;
  step: number;
  isPlaying: boolean;
  speed: number;
  explanation: string;
  highlightedPit: number | null;
  captureAnimation: number | null;
  showCompliment: boolean;
  complimentMessage: string;
  complimentType: 'capture' | 'relay' | 'strategy' | 'comeback';
  sowingAnimation: number[];
}

export const AnimatedDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    ...demoSteps[0],
    step: 0,
    isPlaying: false,
    speed: 1500, // milliseconds between steps
  });
  
  const { playShellSound, playSowingSequence, playCaptureSound, playRelaySound } = useGameSounds();

  const nextStep = useCallback(() => {
    setDemoState(prev => {
      const nextStepIndex = (prev.step + 1) % demoSteps.length;
      const newState = {
        ...prev,
        ...demoSteps[nextStepIndex],
        step: nextStepIndex,
      };

      // Add sound effects and compliments based on the step
      if (nextStepIndex === 3 || nextStepIndex === 6 || nextStepIndex === 9) {
        // Sowing steps
        playSowingSequence(3);
      } else if (nextStepIndex === 4 || nextStepIndex === 7 || nextStepIndex === 10) {
        // Relay steps
        playRelaySound();
        newState.showCompliment = true;
        newState.complimentMessage = "Amazing relay sowing! Keep the momentum going!";
        newState.complimentType = 'relay';
      } else if (nextStepIndex === 11) {
        // Capture step
        playCaptureSound();
        newState.showCompliment = true;
        newState.complimentMessage = "Excellent capture! Strategic thinking pays off!";
        newState.complimentType = 'capture';
      }

      return newState;
    });
  }, [playSowingSequence, playRelaySound, playCaptureSound]);

  const togglePlay = useCallback(() => {
    setDemoState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const reset = useCallback(() => {
    setDemoState(prev => ({
      ...prev,
      ...demoSteps[0],
      step: 0,
      isPlaying: false,
    }));
  }, []);

  const changeSpeed = useCallback(() => {
    setDemoState(prev => ({
      ...prev,
      speed: prev.speed === 1500 ? 800 : prev.speed === 800 ? 2500 : 1500,
    }));
  }, []);

  const closeCompliment = useCallback(() => {
    setDemoState(prev => ({ ...prev, showCompliment: false }));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (demoState.isPlaying) {
      interval = setInterval(nextStep, demoState.speed);
    }
    return () => clearInterval(interval);
  }, [demoState.isPlaying, demoState.speed, nextStep]);

  const renderPit = (index: number, seeds: number) => {
    const isHighlighted = demoState.highlightedPit === index;
    const isCapture = demoState.captureAnimation === index;
    const isSowing = demoState.sowingAnimation?.includes(index) || false;
    
    return (
      <div
        key={index}
        className={`
          pit relative flex items-center justify-center text-sm font-bold text-foreground overflow-hidden
          ${isHighlighted ? 'ring-4 ring-gold-primary ring-opacity-70 animate-pulse' : ''}
          ${isCapture ? 'animate-[capture-glow_1s_ease-out] ring-4 ring-gold-accent' : ''}
          ${isSowing ? 'animate-bounce' : ''}
        `}
      >
        {/* Shell visualization with realistic count */}
        <div className="absolute inset-0 p-1">
          {Array.from({ length: Math.min(seeds, 8) }).map((_, shellIndex) => {
            const angle = (shellIndex / Math.max(seeds, 1)) * 2 * Math.PI;
            const radius = Math.min(20, seeds * 2);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <Shell
                key={shellIndex}
                position={{ 
                  x: 50 + x, 
                  y: 50 + y 
                }}
                delay={shellIndex * 0.1}
                isAnimating={isSowing || isCapture}
              />
            );
          })}
        </div>
        
        {/* Count display */}
        <div className={`
          absolute bottom-1 right-1 bg-wood-primary text-gold-primary text-xs font-bold px-1 rounded
          ${seeds > 8 ? 'block' : 'hidden'}
        `}>
          {seeds}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-background to-muted">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">🎮 Computer vs Computer Demo</h3>
        <p className="text-muted-foreground">Watch and learn the rules step by step</p>
      </div>

      {/* Demo Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          onClick={togglePlay}
          variant="default"
          size="sm"
          className="bg-gold-primary hover:bg-gold-secondary text-foreground"
        >
          {demoState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button onClick={changeSpeed} variant="outline" size="sm">
          <FastForward className="w-4 h-4" />
          {demoState.speed === 800 ? '2x' : demoState.speed === 1500 ? '1x' : '0.5x'}
        </Button>
      </div>

      {/* Mini Game Board */}
      <div className="game-board max-w-2xl mx-auto mb-6">
        {/* Player 2 Score */}
        <div className="flex justify-center mb-4">
          <div className="score-bowl text-lg font-bold text-foreground">
            P2: {demoState.player2Seeds}
          </div>
        </div>

        {/* Player 2 Row (Top) */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {demoState.board.slice(7, 14).reverse().map((seeds, index) => 
            renderPit(13 - index, seeds)
          )}
        </div>

        {/* Player 1 Row (Bottom) */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {demoState.board.slice(0, 7).map((seeds, index) => 
            renderPit(index, seeds)
          )}
        </div>

        {/* Player 1 Score */}
        <div className="flex justify-center">
          <div className="score-bowl text-lg font-bold text-foreground">
            P1: {demoState.player1Seeds}
          </div>
        </div>
      </div>

      {/* Current Player Indicator */}
      <div className="text-center mb-4">
        <div className={`inline-block px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
          demoState.currentPlayer === 1 
            ? 'border-shell-primary bg-shell-primary/20 text-foreground' 
            : 'border-shell-secondary bg-shell-secondary/20 text-foreground'
        }`}>
          <span className="font-semibold">
            {demoState.currentPlayer === 1 ? '🔵 Player 1' : '🔴 Player 2'}'s Turn
          </span>
        </div>
      </div>

      {/* Step Counter */}
      <div className="text-center mb-4">
        <span className="text-sm text-muted-foreground">
          Step {demoState.step + 1} of {demoSteps.length}
        </span>
      </div>

      {/* Explanation */}
      <div className="bg-card border border-gold-primary rounded-xl p-4">
        <p className="text-center text-card-foreground leading-relaxed">
          {demoState.explanation}
        </p>
      </div>

      {/* Rules Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="font-semibold text-foreground mb-2">🎯 Basic Rules:</h4>
          <ul className="text-muted-foreground space-y-1">
            <li>• Sow seeds counterclockwise</li>
            <li>• One seed per pit while sowing</li>
            <li>• Players alternate turns</li>
          </ul>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="font-semibold text-foreground mb-2">⚡ Advanced Rules:</h4>
          <ul className="text-muted-foreground space-y-1">
            <li>• Relay: If last pit has seeds, continue</li>
            <li>• Capture: If last seed lands in empty pit, capture from next pit</li>
            <li>• If next pit empty, capture from opposite</li>
          </ul>
        </div>
      </div>

      {/* Compliment Popup */}
      <ComplimentPopup
        show={demoState.showCompliment}
        message={demoState.complimentMessage}
        type={demoState.complimentType}
        onClose={closeCompliment}
      />
    </Card>
  );
};