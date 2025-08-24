import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Star, Trophy, Zap, Target, Crown } from 'lucide-react';

interface ComplimentPopupProps {
  show: boolean;
  message: string;
  type: 'capture' | 'relay' | 'strategy' | 'comeback';
  onClose: () => void;
}

const complimentIcons = {
  capture: Trophy,
  relay: Zap,
  strategy: Target,
  comeback: Crown,
};

const complimentStyles = {
  capture: 'bg-gold-primary/90 text-wood-text border-gold-secondary',
  relay: 'bg-shell-primary/90 text-white border-shell-secondary',
  strategy: 'bg-secondary/90 text-secondary-foreground border-primary',
  comeback: 'bg-gradient-to-r from-gold-primary to-gold-secondary text-wood-text border-gold-accent',
};

export const ComplimentPopup: React.FC<ComplimentPopupProps> = ({
  show,
  message,
  type,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = complimentIcons[type];

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Play applause sound
      playApplauseSound();
      
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const playApplauseSound = () => {
    // Create a simple applause sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create multiple short bursts to simulate applause
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200 + Math.random() * 100, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }, i * 100);
    }
  };

  if (!show && !isVisible) return null;

  return (
    <div className={`
      fixed inset-0 flex items-center justify-center z-50 pointer-events-none
      transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      <Card className={`
        p-6 border-4 shadow-2xl transform transition-all duration-500 pointer-events-auto
        ${complimentStyles[type]}
        ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        max-w-md mx-4
      `}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Icon className="w-16 h-16 animate-bounce" />
              <div className="absolute -top-2 -right-2">
                <Star className="w-6 h-6 animate-spin text-gold-accent" />
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Excellent Move!</h3>
          <p className="text-lg font-medium">{message}</p>
          
          {/* Sparkle animation */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <Star
                key={i}
                className={`
                  absolute w-4 h-4 text-gold-accent animate-ping
                  ${i % 2 === 0 ? 'animate-pulse' : 'animate-bounce'}
                `}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};