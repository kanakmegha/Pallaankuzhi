import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shell } from '@/components/Shell';
import { Play, BookOpen, Monitor, Gamepad2 } from 'lucide-react';

interface WelcomePageProps {
  onStartGame: (mode: 'human-vs-human' | 'human-vs-computer') => void;
  onStartTutorial: () => void;
  onWatchDemo: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onStartGame,
  onStartTutorial,
  onWatchDemo,
}) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-primary via-wood-secondary to-wood-accent p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gold-primary mb-4 animate-fade-in">
            🏺 Pallanguzhi 🏺
          </h1>
          <p className="text-2xl text-wood-text mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The Ancient Tamil Strategy Game
          </p>
          <p className="text-lg text-wood-text/80 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Experience the traditional game of shells and strategy
          </p>
        </div>


        {/* Game Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Human vs Human */}
          <Card className="p-6 bg-card border-2 border-shell-primary hover:border-gold-primary transition-all duration-300 hover:shadow-glow cursor-pointer group">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-shell-primary/20 rounded-full flex items-center justify-center group-hover:bg-gold-primary/20 transition-colors">
                <Gamepad2 className="w-8 h-8 text-shell-primary group-hover:text-gold-primary" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">2 Players</h3>
              <p className="text-muted-foreground mb-4">Play with a friend locally</p>
              <Button
                onClick={() => onStartGame('human-vs-human')}
                className="w-full bg-shell-primary hover:bg-shell-secondary text-white"
              >
                Start Game
              </Button>
            </div>
          </Card>

          {/* Human vs Computer */}
          <Card className="p-6 bg-card border-2 border-secondary hover:border-gold-primary transition-all duration-300 hover:shadow-glow cursor-pointer group">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-gold-primary/20 transition-colors">
                <Play className="w-8 h-8 text-secondary group-hover:text-gold-primary" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">vs AI</h3>
              <p className="text-muted-foreground mb-4">Challenge the computer</p>
              <Button
                onClick={() => onStartGame('human-vs-computer')}
                className="w-full bg-secondary hover:bg-secondary/80"
              >
                Play vs AI
              </Button>
            </div>
          </Card>

          {/* Interactive Tutorial */}
          <Card className="p-6 bg-card border-2 border-gold-primary hover:border-gold-secondary transition-all duration-300 hover:shadow-glow cursor-pointer group">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gold-primary/20 rounded-full flex items-center justify-center group-hover:bg-gold-secondary/20 transition-colors">
                <BookOpen className="w-8 h-8 text-gold-primary group-hover:text-gold-secondary" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">Learn</h3>
              <p className="text-muted-foreground mb-4">Interactive tutorial</p>
              <Button
                onClick={onStartTutorial}
                className="w-full bg-gold-primary hover:bg-gold-secondary text-wood-text"
              >
                Start Tutorial
              </Button>
            </div>
          </Card>

          {/* Watch Demo */}
          <Card className="p-6 bg-card border-2 border-muted hover:border-gold-primary transition-all duration-300 hover:shadow-glow cursor-pointer group">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center group-hover:bg-gold-primary/20 transition-colors">
                <Monitor className="w-8 h-8 text-muted-foreground group-hover:text-gold-primary" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">Demo</h3>
              <p className="text-muted-foreground mb-4">Watch gameplay</p>
              <Button
                onClick={onWatchDemo}
                className="w-full bg-muted hover:bg-muted/80"
              >
                Watch Demo
              </Button>
            </div>
          </Card>
        </div>

        {/* Game Rules Preview */}
        <Card className="p-6 bg-card/80 border border-gold-primary">
          <h3 className="text-2xl font-bold text-center text-gold-primary mb-6">Quick Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">🌰</div>
              <h4 className="font-bold text-card-foreground mb-2">Objective</h4>
              <p className="text-muted-foreground">Capture more shells than your opponent</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🔄</div>
              <h4 className="font-bold text-card-foreground mb-2">Sowing</h4>
              <p className="text-muted-foreground">Pick up shells and sow them counterclockwise</p>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-bold text-card-foreground mb-2">Capture</h4>
              <p className="text-muted-foreground">Land in empty pit to capture opponent's shells</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};