import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WelcomePage } from "./components/WelcomePage";
import { PallanguzhiGame } from "./components/PallanguzhiGame";
import { AnimatedDemo } from "./components/AnimatedDemo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'game' | 'tutorial'>('welcome');
  const [gameMode, setGameMode] = useState<'human-vs-human' | 'human-vs-computer'>('human-vs-human');
  const [showDemo, setShowDemo] = useState(false);

  const handleStartGame = (mode: 'human-vs-human' | 'human-vs-computer') => {
    setGameMode(mode);
    setCurrentView('game');
  };

  const handleStartTutorial = () => {
    setCurrentView('tutorial');
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomePage
            onStartGame={handleStartGame}
            onStartTutorial={handleStartTutorial}
            onWatchDemo={handleWatchDemo}
          />
        );
      case 'game':
        return <PallanguzhiGame key={`game-${gameMode}`} />;
      case 'tutorial':
        return <PallanguzhiGame key="tutorial" />;
      default:
        return <Index />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={renderCurrentView()} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* Demo Dialog */}
        <Dialog open={showDemo} onOpenChange={setShowDemo}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl text-center text-gold-primary">
                🎮 Pallanguzhi Demo - Computer vs Computer
              </DialogTitle>
            </DialogHeader>
            <AnimatedDemo />
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
